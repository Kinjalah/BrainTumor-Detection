from __future__ import annotations

from typing import List

import pandas as pd

from .models import (
    Room,
    Teacher,
    Course,
    Group,
    Workload,
    Preassignment,
    ProblemInstance,
)
from .constants import DAYS_DEFAULT, default_slots


def create_template_excel(path: str) -> None:
    # Build default frames
    days = DAYS_DEFAULT
    slots = default_slots()

    df_timeslots = pd.DataFrame(
        [
            {
                "Day": s.day,
                "SlotIndex": s.index,
                "Start": s.start.strftime("%H:%M"),
                "End": s.end.strftime("%H:%M"),
            }
            for s in slots
        ]
    )

    df_rooms = pd.DataFrame(
        [
            {"RoomId": f"CR{i}", "Type": "Classroom"} for i in range(1, 4)
        ]
        + [{"RoomId": f"L{i}", "Type": "Lab"} for i in range(1, 10)]
    )

    df_teachers = pd.DataFrame(
        [{"TeacherId": "T1", "Name": "", "MaxLoadPerWeek": ""}]
    )

    df_courses = pd.DataFrame(
        [
            {"CourseId": "SUB1", "Name": "", "Type": "Lecture", "DurationSlots": 1},
            {"CourseId": "LAB1", "Name": "", "Type": "Lab", "DurationSlots": 2},
        ]
    )

    df_groups = pd.DataFrame(
        [
            {"GroupId": "SY-A", "Year": "SY", "Division": "A", "Batch": "", "Kind": "Division"},
            {"GroupId": "SY-A-B1", "Year": "SY", "Division": "A", "Batch": "B1", "Kind": "Batch"},
        ]
    )

    df_workloads = pd.DataFrame(
        [
            {
                "GroupId": "SY-A",
                "CourseId": "SUB1",
                "TeacherId": "T1",
                "SessionsPerWeek": 3,
                "RoomTypeRequired": "Classroom",
            },
            {
                "GroupId": "SY-A-B1",
                "CourseId": "LAB1",
                "TeacherId": "T1",
                "SessionsPerWeek": 1,
                "RoomTypeRequired": "Lab",
            },
        ]
    )

    df_pre = pd.DataFrame(
        [
            {
                "GroupId": "",
                "CourseId": "",
                "TeacherId": "",
                "Day": "",
                "StartSlotIndex": "",
                "DurationSlots": "",
                "RoomId": "",
            }
        ]
    )

    with pd.ExcelWriter(path, engine="openpyxl") as writer:
        df_timeslots.to_excel(writer, sheet_name="Timeslots", index=False)
        df_rooms.to_excel(writer, sheet_name="Rooms", index=False)
        df_teachers.to_excel(writer, sheet_name="Teachers", index=False)
        df_courses.to_excel(writer, sheet_name="Courses", index=False)
        df_groups.to_excel(writer, sheet_name="Groups", index=False)
        df_workloads.to_excel(writer, sheet_name="Workloads", index=False)
        df_pre.to_excel(writer, sheet_name="Preassignments", index=False)


def _read_nonempty(df: pd.DataFrame) -> pd.DataFrame:
    df2 = df.copy()
    if "#" in df2.columns:
        df2 = df2[df2["#"].astype(str).str.startswith("#") == False]
    df2 = df2.dropna(how="all")
    return df2


def read_instance_from_excel(path: str) -> ProblemInstance:
    xls = pd.ExcelFile(path)

    df_times = _read_nonempty(pd.read_excel(xls, "Timeslots"))
    days = list(df_times["Day"].dropna().astype(str).unique())
    slots_per_day = int(df_times["SlotIndex"].max()) + 1

    df_rooms = _read_nonempty(pd.read_excel(xls, "Rooms"))
    rooms: List[Room] = [
        Room(room_id=str(r["RoomId"]).strip(), room_type=str(r["Type"]).strip())
        for _, r in df_rooms.iterrows()
    ]

    df_teachers = _read_nonempty(pd.read_excel(xls, "Teachers"))
    teachers: List[Teacher] = []
    for _, r in df_teachers.iterrows():
        max_load = None
        if "MaxLoadPerWeek" in r and pd.notna(r["MaxLoadPerWeek"]):
            try:
                max_load = int(r["MaxLoadPerWeek"])
            except Exception:
                max_load = None
        teachers.append(
            Teacher(
                teacher_id=str(r["TeacherId"]).strip(),
                name=str(r.get("Name", "")) if pd.notna(r.get("Name", "")) else None,
                max_load_per_week=max_load,
            )
        )

    df_courses = _read_nonempty(pd.read_excel(xls, "Courses"))
    courses: List[Course] = []
    for _, r in df_courses.iterrows():
        duration = int(r.get("DurationSlots", 1))
        courses.append(
            Course(
                course_id=str(r["CourseId"]).strip(),
                name=str(r.get("Name", "")) if pd.notna(r.get("Name", "")) else None,
                course_type=str(r["Type"]).strip(),
                duration_slots=duration,
            )
        )

    df_groups = _read_nonempty(pd.read_excel(xls, "Groups"))
    groups: List[Group] = []
    for _, r in df_groups.iterrows():
        groups.append(
            Group(
                group_id=str(r["GroupId"]).strip(),
                year=str(r["Year"]).strip(),
                division=str(r["Division"]).strip(),
                batch=(str(r["Batch"]).strip() if pd.notna(r.get("Batch", "")) and str(r.get("Batch", "")).strip() else None),
                kind=str(r["Kind"]).strip(),
            )
        )

    df_workloads = _read_nonempty(pd.read_excel(xls, "Workloads"))
    workloads: List[Workload] = []
    for _, r in df_workloads.iterrows():
        workloads.append(
            Workload(
                group_id=str(r["GroupId"]).strip(),
                course_id=str(r["CourseId"]).strip(),
                teacher_id=str(r["TeacherId"]).strip(),
                sessions_per_week=int(r["SessionsPerWeek"]),
                room_type_required=str(r["RoomTypeRequired"]).strip(),
            )
        )

    preassignments: List[Preassignment] = []
    if "Preassignments" in xls.sheet_names:
        df_pre = _read_nonempty(pd.read_excel(xls, "Preassignments"))
        for _, r in df_pre.iterrows():
            if pd.isna(r.get("GroupId")) or str(r.get("GroupId", "")).strip() == "":
                continue
            preassignments.append(
                Preassignment(
                    group_id=str(r["GroupId"]).strip(),
                    course_id=str(r["CourseId"]).strip(),
                    teacher_id=str(r["TeacherId"]).strip(),
                    day=str(r["Day"]).strip(),
                    start_slot_index=int(r["StartSlotIndex"]),
                    duration_slots=int(r["DurationSlots"]),
                    room_id=(str(r["RoomId"]).strip() if pd.notna(r.get("RoomId", "")) and str(r.get("RoomId", "")).strip() else None),
                )
            )

    instance = ProblemInstance(
        days=days,
        slots_per_day=slots_per_day,
        rooms=rooms,
        teachers=teachers,
        courses=courses,
        groups=groups,
        workloads=workloads,
        preassignments=preassignments,
    )
    instance.build_indexes()
    return instance
