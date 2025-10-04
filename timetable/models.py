from __future__ import annotations

from dataclasses import dataclass
from typing import List, Dict, Optional, Tuple


RoomType = str  # "Classroom" | "Lab"
CourseType = str  # "Lecture" | "Lab"
GroupKind = str  # "Division" | "Batch"


@dataclass
class Room:
    room_id: str
    room_type: RoomType  # Classroom or Lab


@dataclass
class Teacher:
    teacher_id: str
    name: Optional[str] = None
    max_load_per_week: Optional[int] = None


@dataclass
class Course:
    course_id: str
    name: Optional[str]
    course_type: CourseType  # Lecture or Lab
    duration_slots: int  # 1 or 2 typically


@dataclass
class Group:
    group_id: str  # e.g., SY-A (division) or SY-A-B1 (batch)
    year: str  # SY or TY
    division: str  # A or B
    batch: Optional[str]  # e.g., B1..B4 or None for division
    kind: GroupKind  # Division or Batch


@dataclass
class Workload:
    group_id: str  # who attends (division or batch)
    course_id: str
    teacher_id: str
    sessions_per_week: int
    room_type_required: RoomType  # Classroom or Lab


@dataclass
class Timeslot:
    day: str
    slot_index: int  # 0-based index within the day


@dataclass
class Preassignment:
    group_id: str
    course_id: str
    teacher_id: str
    day: str
    start_slot_index: int
    duration_slots: int
    room_id: Optional[str] = None


@dataclass
class ProblemInstance:
    days: List[str]
    slots_per_day: int
    rooms: List[Room]
    teachers: List[Teacher]
    courses: List[Course]
    groups: List[Group]
    workloads: List[Workload]
    preassignments: List[Preassignment]

    # Lookup maps for convenience
    room_by_id: Dict[str, Room] = None
    teacher_by_id: Dict[str, Teacher] = None
    course_by_id: Dict[str, Course] = None
    group_by_id: Dict[str, Group] = None

    def build_indexes(self) -> None:
        self.room_by_id = {r.room_id: r for r in self.rooms}
        self.teacher_by_id = {t.teacher_id: t for t in self.teachers}
        self.course_by_id = {c.course_id: c for c in self.courses}
        self.group_by_id = {g.group_id: g for g in self.groups}


@dataclass
class SessionDecision:
    group_id: str
    course_id: str
    teacher_id: str
    duration_slots: int
    day: str
    start_slot_index: int
    room_id: str


@dataclass
class Solution:
    # All sessions scheduled
    sessions: List[SessionDecision]

    def sessions_by_group(self) -> Dict[str, List[SessionDecision]]:
        by: Dict[str, List[SessionDecision]] = {}
        for s in self.sessions:
            by.setdefault(s.group_id, []).append(s)
        return by

    def sessions_by_day_slot(self) -> Dict[Tuple[str, int], List[SessionDecision]]:
        by: Dict[Tuple[str, int], List[SessionDecision]] = {}
        for s in self.sessions:
            for offset in range(s.duration_slots):
                key = (s.day, s.start_slot_index + offset)
                by.setdefault(key, []).append(s)
        return by
