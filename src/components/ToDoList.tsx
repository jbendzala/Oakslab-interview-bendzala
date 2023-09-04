import React, { useState, useEffect } from "react";
import { Container, Typography, Checkbox, Button, Stack } from "@mui/material";

type Task = {
  name: string;
  completed: boolean;
};

const phases: Task[][] = [
  [
    { name: "Do market research", completed: false },
    { name: "Cold calls to potentional clients", completed: false },
    { name: "Idea of MVP", completed: false },
  ],
  [
    { name: "Pick business name", completed: false },
    { name: "Design and code MVP", completed: false },
    { name: "Get cutomers on board", completed: false },
  ],
  [{ name: "Launch", completed: false }],
];

export const ToDoList = () => {
  const [currentPhase, setCurrentPhase] = useState<number>(
    localStorage.getItem("currentPhase")
      ? +localStorage.getItem("currentPhase")!
      : 0
  );
  const [completedPhases, setCompletedPhases] = useState<string>(
    localStorage.getItem("completedPhases")
      ? localStorage.getItem("completedPhases")!
      : ""
  );
  const [tasks, setTasks] = useState<Task[]>(
    localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks")!)
      : phases[currentPhase]
  );

  useEffect(() => {
    // Load saved phase and tasks from local storage
    const savedCurrentPhase = localStorage.getItem("currentPhase");
    const savedCompletedPhases = localStorage.getItem("completedPhases");
    const savedTasks = localStorage.getItem("tasks");

    if (savedCurrentPhase && savedTasks && savedCompletedPhases) {
      setCurrentPhase(Number(savedCurrentPhase));
      setTasks(JSON.parse(savedTasks));
      setCompletedPhases(savedCompletedPhases);
    }
  }, []);

  useEffect(() => {
    // Save current phase and tasks to local storage
    localStorage.setItem("currentPhase", currentPhase.toString());
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [completedPhases, currentPhase, tasks]);

  useEffect(() => {
    // Check if all tasks in the current phase are completed
    if (
      tasks.every((task) => task.completed) &&
      currentPhase < phases.length - 1
    ) {
      // Increment phase when all tasks are completed and there is a next phase
      setCurrentPhase(currentPhase + 1);
      setCompletedPhases(currentPhase.toString());

      // Merge tasks from both the current and next phases
      setTasks((prevTasks) => [
        ...prevTasks,
        ...phases[currentPhase + 1].filter(
          (task) => !prevTasks.some((prevTask) => prevTask.name === task.name)
        ),
      ]);
    }
  }, [tasks, currentPhase]);

  const handleTaskChange = (taskIndex: number, phaseIndex: number) => {
    if (phaseIndex === 0) {
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed;
      setTasks(updatedTasks);
    }
    if (phaseIndex === 1) {
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex + phaseIndex + 2].completed =
        !updatedTasks[taskIndex + phaseIndex + 2].completed;
      setTasks(updatedTasks);
    }
    if (phaseIndex === 2) {
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex + phaseIndex + 4].completed =
        !updatedTasks[taskIndex + phaseIndex + 4].completed;
      setTasks(updatedTasks);
    }
  };

  const reopenPhase = (
    index: number,
    phaseIndex: number,
    tasksLength: number
  ) => {
    if (phaseIndex === 0) {
      const updatedTasks = [...tasks];
      updatedTasks[index].completed = false;
      setTasks(updatedTasks.slice(0, tasksLength));
      setCurrentPhase(0);
    }
    if (phaseIndex === 1) {
      const updatedTasks = [...tasks];
      updatedTasks[index + phaseIndex + 2].completed = false;
      setTasks(updatedTasks.slice(0, -1));
      setCurrentPhase(1);
    }
  };

  return (
    <Container>
      <Typography variant='h4'>Startup Progress</Typography>
      {phases.map((phaseTasks, phaseIndex) => (
        <Stack key={phaseIndex}>
          <Typography variant='h5'>Phase {phaseIndex + 1}</Typography>
          {phaseIndex <= currentPhase && (
            <Stack>
              {phaseTasks.map((task, taskIndex) => (
                <Stack key={taskIndex}>
                  <Stack direction='row' spacing={2} alignItems='center'>
                    <Checkbox
                      checked={tasks.some(
                        (t) => t.name === task.name && t.completed
                      )}
                      onChange={() => handleTaskChange(taskIndex, phaseIndex)}
                      disabled={currentPhase !== 0 && currentPhase > phaseIndex}
                    />
                    <Typography variant='subtitle2'>{task.name}</Typography>
                  </Stack>
                  {phaseTasks.filter((task) => task.completed).length ===
                    phaseTasks.length &&
                    taskIndex === phaseTasks.length - 1 &&
                    phaseIndex !== phases.length - 1 && (
                      <Button
                        variant='outlined'
                        onClick={() =>
                          reopenPhase(taskIndex, phaseIndex, phaseTasks.length)
                        }
                      >
                        Reopen
                      </Button>
                    )}
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      ))}
    </Container>
  );
};
