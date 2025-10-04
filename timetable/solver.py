from __future__ import annotations

from typing import Dict, List, Tuple, Optional
from itertools import combinations

from constraint import Problem, AllDifferentConstraint

from .models import ProblemInstance, SessionDecision, Solution, Workload


class TimetableSolver:
    def __init__(self, instance: ProblemInstance):
        self.instance = instance

    def solve(self, seed: Optional[int] = None, time_limit_s: Optional[int] = None) -> Optional[Solution]:
        inst = self.instance

        # Expand workloads into per-session units, taking into account preassignments
        # Map: session_key -> (group_id, course_id, teacher_id, duration, fixed_assignment)
        session_defs: Dict[str, Tuple[str, str, str, int, Optional[Tuple[str, int, str]]]] = {}

        # Index preassignments by (group, course, teacher) for quick consumption
        pre_by_key: Dict[Tuple[str, str, str], List[Tuple[str, int, Optional[str]]]] = {}
        for p in inst.preassignments:
            key = (p.group_id, p.course_id, p.teacher_id)
            pre_by_key.setdefault(key, []).append((p.day, p.start_slot_index, p.room_id))

        # Build course duration map
        course_duration: Dict[str, int] = {c.course_id: c.duration_slots for c in inst.courses}

        def add_session_key(prefix: str, idx: int) -> str:
            return f"{prefix}__{idx}"

        sessions_counter = 0
        for wl in inst.workloads:
            duration = course_duration.get(wl.course_id, 1)
            pre_list = pre_by_key.get((wl.group_id, wl.course_id, wl.teacher_id), [])

            # First, create fixed sessions for preassignments
            for i, (day, start_idx, room_id) in enumerate(pre_list):
                skey = add_session_key(f"{wl.group_id}|{wl.course_id}|{wl.teacher_id}", sessions_counter)
                sessions_counter += 1
                session_defs[skey] = (
                    wl.group_id,
                    wl.course_id,
                    wl.teacher_id,
                    duration,
                    (day, start_idx, room_id if room_id else ""),
                )

            # Remaining sessions to schedule
            remaining = max(0, wl.sessions_per_week - len(pre_list))
            for _ in range(remaining):
                skey = add_session_key(f"{wl.group_id}|{wl.course_id}|{wl.teacher_id}", sessions_counter)
                sessions_counter += 1
                session_defs[skey] = (
                    wl.group_id,
                    wl.course_id,
                    wl.teacher_id,
                    duration,
                    None,
                )

        problem = Problem()

        # Domains
        days = inst.days
        slots_range = list(range(inst.slots_per_day))

        # Room domains per course type
        # We will rely on workloads' room_type_required when filtering
        rooms_by_type: Dict[str, List[str]] = {}
        for room in inst.rooms:
            rooms_by_type.setdefault(room.room_type, []).append(room.room_id)

        # Variables for each session: day, start, room
        for skey, (group_id, course_id, teacher_id, duration, fixed) in session_defs.items():
            var_day = f"{skey}__day"
            var_start = f"{skey}__start"
            var_room = f"{skey}__room"

            # Determine room type required via associated workload
            wl: Optional[Workload] = next((w for w in inst.workloads if w.group_id == group_id and w.course_id == course_id and w.teacher_id == teacher_id), None)
            room_type_required = wl.room_type_required if wl else "Classroom"
            room_domain = rooms_by_type.get(room_type_required, [])

            # Valid start indices for this duration: must fit within the day
            valid_starts = [i for i in slots_range if i + duration - 1 < inst.slots_per_day]

            if fixed is not None:
                day_fixed, start_fixed, room_fixed = fixed
                # If room not specified in preassignment, keep room domain
                if room_fixed:
                    problem.addVariable(var_room, [room_fixed])
                else:
                    problem.addVariable(var_room, room_domain)
                problem.addVariable(var_day, [day_fixed])
                problem.addVariable(var_start, [start_fixed])
            else:
                problem.addVariable(var_room, room_domain)
                problem.addVariable(var_day, days)
                problem.addVariable(var_start, valid_starts)

        # Conflict constraints: teacher, group, room cannot overlap on same day
        def no_overlap(d1: str, s1: int, dur1: int, d2: str, s2: int, dur2: int) -> bool:
            if d1 != d2:
                return True
            end1 = s1 + dur1 - 1
            end2 = s2 + dur2 - 1
            return end1 < s2 or end2 < s1

        session_keys = list(session_defs.keys())

        # Teacher conflicts
        for i, j in combinations(range(len(session_keys)), 2):
            si = session_keys[i]
            sj = session_keys[j]
            gi, ci, ti, di, _ = session_defs[si]
            gj, cj, tj, dj, _ = session_defs[sj]
            if ti == tj:
                vi_day, vi_start = f"{si}__day", f"{si}__start"
                vj_day, vj_start = f"{sj}__day", f"{sj}__start"
                problem.addConstraint(
                    lambda di1, si1, di2, si2, d1=di, d2=dj: no_overlap(di1, si1, d1, di2, si2, d2),
                    (vi_day, vi_start, vj_day, vj_start),
                )

        # Group conflicts
        for i, j in combinations(range(len(session_keys)), 2):
            si = session_keys[i]
            sj = session_keys[j]
            gi, ci, ti, di, _ = session_defs[si]
            gj, cj, tj, dj, _ = session_defs[sj]
            if gi == gj:
                vi_day, vi_start = f"{si}__day", f"{si}__start"
                vj_day, vj_start = f"{sj}__day", f"{sj}__start"
                problem.addConstraint(
                    lambda di1, si1, di2, si2, d1=di, d2=dj: no_overlap(di1, si1, d1, di2, si2, d2),
                    (vi_day, vi_start, vj_day, vj_start),
                )

        # Room conflicts and type match is enforced via domain; here we avoid double-booking same room
        for i, j in combinations(range(len(session_keys)), 2):
            si = session_keys[i]
            sj = session_keys[j]
            gi, ci, ti, di, _ = session_defs[si]
            gj, cj, tj, dj, _ = session_defs[sj]
            vi_day, vi_start, vi_room = f"{si}__day", f"{si}__start", f"{si}__room"
            vj_day, vj_start, vj_room = f"{sj}__day", f"{sj}__start", f"{sj}__room"
            problem.addConstraint(
                lambda di1, si1, ri1, di2, si2, ri2, d1=di, d2=dj: True
                if ri1 != ri2
                else no_overlap(di1, si1, d1, di2, si2, d2),
                (vi_day, vi_start, vi_room, vj_day, vj_start, vj_room),
            )

        # Solve
        if seed is not None:
            import random

            random.seed(seed)
        solutions = problem.getSolutions()
        if not solutions:
            return None

        # Choose first solution (could add objective/heuristics later)
        sol = solutions[0]

        session_decisions: List[SessionDecision] = []
        for skey, (group_id, course_id, teacher_id, duration, _) in session_defs.items():
            day = sol[f"{skey}__day"]
            start = sol[f"{skey}__start"]
            room = sol[f"{skey}__room"]
            session_decisions.append(
                SessionDecision(
                    group_id=group_id,
                    course_id=course_id,
                    teacher_id=teacher_id,
                    duration_slots=duration,
                    day=day,
                    start_slot_index=start,
                    room_id=room,
                )
            )

        return Solution(sessions=session_decisions)
