from __future__ import annotations

import sys
from pathlib import Path
from typing import Optional

import typer
from rich import print

from .excel_io import create_template_excel, read_instance_from_excel
from .solver import TimetableSolver
from .renderer import render_to_excel

app = typer.Typer(add_completion=False, no_args_is_help=True)


@app.command()
def template(output: str = typer.Option("timetable_template.xlsx", "--output", "-o", help="Path to write the Excel template")):
    """Create an Excel template to define timetable inputs."""
    out_path = Path(output)
    create_template_excel(str(out_path))
    print(f"[green]Template written to[/green] {out_path}")


@app.command()
def solve(
    input: str = typer.Option(..., "--input", "-i", help="Path to Excel input"),
    output: str = typer.Option("timetable_out.xlsx", "--output", "-o", help="Path to write generated timetable"),
    seed: Optional[int] = typer.Option(None, help="Random seed for solver"),
):
    """Solve the timetable CSP from an Excel input."""
    inst = read_instance_from_excel(input)
    solver = TimetableSolver(inst)
    solution = solver.solve(seed=seed)
    if solution is None:
        print("[red]No feasible timetable found with given constraints.[/red]")
        raise typer.Exit(code=2)
    render_to_excel(inst, solution, output)
    print(f"[green]Timetable written to[/green] {output}")


@app.command()
def validate(input: str = typer.Option(..., "--input", "-i", help="Path to Excel input")):
    """Validate the Excel input is structurally sound."""
    try:
        _ = read_instance_from_excel(input)
        print("[green]Input looks valid.[/green]")
    except Exception as e:
        print(f"[red]Invalid input:[/red] {e}")
        raise typer.Exit(code=2)


def run():
    app()


if __name__ == "__main__":
    run()
