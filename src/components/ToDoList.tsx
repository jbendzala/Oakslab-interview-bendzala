import React, { useState, useEffect } from "react";
import {
  Typography,
  Checkbox,
  Button,
  Stack,
  FormControlLabel,
  Card,
  Fade,
} from "@mui/material";

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

  const [tasks, setTasks] = useState<Task[]>(
    localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks")!)
      : phases[currentPhase]
  );

  useEffect(() => {
    // Save current phase and tasks to local storage
    localStorage.setItem("currentPhase", currentPhase.toString());
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [currentPhase, tasks]);

  useEffect(() => {
    if (
      tasks.every((task) => task.completed) &&
      currentPhase < phases.length - 1
    ) {
      setCurrentPhase(currentPhase + 1);

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
    <Stack alignItems='center' spacing={2} sx={{ m: 5 }}>
      <Typography variant='h4'>Startup Progress</Typography>
      <Card
        variant='outlined'
        sx={{
          backgroundColor: (theme) => theme.palette.secondary.light,
          borderRadius: "50px",
          borderWidth: "2px",
          borderColor: (theme) => theme.palette.primary.main,
          width: "100%",
          color: (theme) => theme.palette.primary.light,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack
          alignItems='start'
          justifyContent='center'
          sx={{ m: 5 }}
          spacing={3}
        >
          {phases.map((phaseTasks, phaseIndex) => (
            <Stack key={phaseIndex}>
              <Typography variant='h5'>Phase {phaseIndex + 1}</Typography>
              {phaseIndex <= currentPhase && (
                <Fade in timeout={600}>
                  <Stack>
                    {phaseTasks.map((task, taskIndex) => (
                      <Stack key={taskIndex}>
                        <Stack direction='row' spacing={2} alignItems='center'>
                          <FormControlLabel
                            label={task.name}
                            control={
                              <Checkbox
                                checked={tasks.some(
                                  (t) => t.name === task.name && t.completed
                                )}
                                onChange={() =>
                                  handleTaskChange(taskIndex, phaseIndex)
                                }
                                disabled={
                                  currentPhase !== 0 &&
                                  currentPhase > phaseIndex
                                }
                              />
                            }
                          />
                        </Stack>
                        {phaseTasks.filter((task) => task.completed).length ===
                          phaseTasks.length &&
                          taskIndex === phaseTasks.length - 1 &&
                          phaseIndex !== phases.length - 1 && (
                            <Button
                              variant='outlined'
                              onClick={() =>
                                reopenPhase(
                                  taskIndex,
                                  phaseIndex,
                                  phaseTasks.length
                                )
                              }
                              sx={{ width: 300, borderRadius: 4 }}
                            >
                              Reopen
                            </Button>
                          )}
                      </Stack>
                    ))}
                  </Stack>
                </Fade>
              )}
            </Stack>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
};
