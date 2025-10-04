from __future__ import annotations

from typing import Dict, List, Tuple

import pandas as pd

from .models import ProblemInstance, Solution, SessionDecision


def _build_grid(days: List[str], slots_per_day: int) -> Dict[Tuple[str, int], List[str]]:
    grid: Dict[Tuple[str, int], List[str]] = {}
    for d in days:
        for s in range(slots_per_day):
            grid[(d, s)] = []
    return grid


def _label(session: SessionDecision) -> str:
    return f"{session.course_id} | {session.teacher_id} | {session.room_id}"


def render_to_excel(instance: ProblemInstance, solution: Solution, out_path: str) -> None:
    # For each division-level group, we will render a sheet. We will also render each batch as separate sheet.
    by_group: Dict[str, List[SessionDecision]] = solution.sessions_by_group()

    # Collect all unique group ids
    group_ids = list(instance.group_by_id.keys())

    with pd.ExcelWriter(out_path, engine="openpyxl") as writer:
        for gid in group_ids:
            group = instance.group_by_id[gid]
            sessions = by_group.get(gid, [])
            grid = _build_grid(instance.days, instance.slots_per_day)

            for s in sessions:
                for off in range(s.duration_slots):
                    key = (s.day, s.start_slot_index + off)
                    grid[key].append(_label(s))

            # Build DataFrame with days as rows and slots as columns
            data = []
            columns = [f"S{idx+1}" for idx in range(instance.slots_per_day)]
            for day in instance.days:
                row = []
                for slot_index in range(instance.slots_per_day):
                    cell_entries = grid[(day, slot_index)]
                    row.append("\n".join(cell_entries))
                data.append([day] + row)

            df = pd.DataFrame(data, columns=["Day"] + columns)
            sheet_name = gid[:31]  # Excel sheet name limit
            df.to_excel(writer, sheet_name=sheet_name, index=False)
