import { useState, useEffect } from 'react';
import moment from 'moment';
import { firebase } from '../firebase';
import { collatedTasksExist } from '../helpers';


export const useTasks = selectedProject => {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  
  useEffect(() => {
    let unsubscribe = firebase
      .firestore()
      .collection('tasks')
      .where('userId', '==', 'jllFXlwyyAL3tzHMtzRbw');

    // effectively retrieving particular tasks based on projectId
    // we pass in a selectedProject (eg Inbox, Today, Next 7 Days)
    // and if it doesn't exist then we check the projectId
    // 'moment' is used to handle dates
    unsubscribe = selectedProject && !collatedTasksExist(selectedProject)
      ? (unsubscribe = unsubscribe.where('projectId', '==', selectedProject))
      : selectedProject === 'TODAY'
      ? (unsubscribe = unsubscribe.where(
          'date',
          '==',
          moment().format('DD/MM/YYYY')
        ))
      : selectedProject === 'INBOX' || selectedProject === 9
      ? (unsubscribe = unsubscribe.where('date', '==', ''))
      : unsubscribe;

    unsubscribe = unsubscribe.onSnapshot(snapshot => {
      const newTasks = snapshot.docs.map(task => ({
        id: task.id,
        ...task.data(),
      }));

      setTasks(
        selectedProject === 'NEXT_7'
        ? newTasks.filter(
          task => moment(task.date, 'DD-MM-YYYY').diff(moment(), 'days') <= 7 &&
          task.archived !== true
        )
        : newTasks.filter(task => task.archived !== true)
      );

      setArchivedTasks(newTasks.filter(task => task.archived !== false));
    });

    return () => unsubscribe();
  }, [selectedProject]);
  // once selectedProject changes, re-run all the above code

  return { tasks, archivedTasks };
};

export const useProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection('projects')
      .where('userId', '==', 'jllFXlwyyAL3tzHMtzRbw')
      .orderBy('projectId')
      .get()
      .then(snapshot => {
        const allProjects = snapshot.docs.map(project => ({
          ...project.data(),
          docId: project.id,
        }));

        if (JSON.stringify(allProjects) !== JSON.stringify(projects)) {
          setProjects(allProjects);
        }
      });
  }, [projects]);

  return { projects, setProjects };
};