from __future__ import annotations

from dataclasses import dataclass
from datetime import time
from typing import List, Dict


DAYS_DEFAULT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]


@dataclass(frozen=True)
class Slot:
    day: str
    index: int  # 0-based index within the day
    start: time
    end: time

    @property
    def label(self) -> str:
        return f"{self.start.strftime('%H:%M')}-{self.end.strftime('%H:%M')}"


def default_slots() -> List[Slot]:
    # College hours: 09:00-17:10
    # Breaks: 11:00-11:10 and 13:10-14:10
    # We'll define 7 teaching slots:
    # 1) 09:00-10:00
    # 2) 10:00-11:00
    # 3) 11:10-12:10
    # 4) 12:10-13:10
    # 5) 14:10-15:10
    # 6) 15:10-16:10
    # 7) 16:10-17:10
    slot_ranges = [
        (time(9, 0), time(10, 0)),
        (time(10, 0), time(11, 0)),
        (time(11, 10), time(12, 10)),
        (time(12, 10), time(13, 10)),
        (time(14, 10), time(15, 10)),
        (time(15, 10), time(16, 10)),
        (time(16, 10), time(17, 10)),
    ]

    slots: List[Slot] = []
    for day in DAYS_DEFAULT:
        for idx, (start, end) in enumerate(slot_ranges):
            slots.append(Slot(day=day, index=idx, start=start, end=end))
    return slots


def day_to_index(days: List[str]) -> Dict[str, int]:
    return {day: i for i, day in enumerate(days)}
