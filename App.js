import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.log('Error al guardar las tareas:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.log('Error al cargar las tareas:', error);
    }
  };

  const addTask = () => {
    if (task.trim()) {
      const newTask = {
        id: Date.now().toString(),
        text: task,
        completed: false,
        date: selectedDate.toISOString(),
      };
      setTasks([...tasks, newTask]);
      setTask('');
      setSelectedDate(new Date());
      saveTasks();
    }
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks();
  };

  const completeTask = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: !task.completed,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    saveTasks();
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const selectTask = (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    setSelectedTask(task);
    toggleModal();
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const closeDatePicker = () => {
    setShowDatePicker(false);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(currentDate);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <TextInput
          style={{ borderBottomWidth: 1, marginBottom: 10, marginTop: 40 }}
          placeholder="Nueva tarea"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5 }} onPress={addTask}>
          <Text style={{ color: 'white', textAlign: 'center' }}>Agregar tarea</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={{
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: 'gray',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: selectedTask && selectedTask.id === task.id ? 'lightgray' : 'white',
            }}
            onPress={() => selectTask(task.id)}
          >
            <View style={{ flex: 1 }}>
              <Text>{task.text}</Text>
              {task.completed && <Text style={{ color: 'green' }}>✓ Completada</Text>}
              {task.date && <Text style={{ color: 'red' }}>Fecha: {new Date(task.date).toLocaleDateString()}</Text>}
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: task.completed ? 'gray' : 'green',
                padding: 10,
                borderRadius: 5,
                marginLeft: 10,
              }}
              onPress={() => completeTask(task.id)}
              disabled={task.completed}
            >
              <Text style={{ color: 'white' }}>Completada</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'red', padding: 10, borderRadius: 5, marginLeft: 10 }}
              onPress={() => deleteTask(task.id)}
            >
              <Text style={{ color: 'white' }}>Eliminar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal visible={showModal} animationType="slide">
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={{ padding: 20 }} onPress={toggleModal}>
            <Text>Volver</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text>Tarea: {selectedTask ? selectedTask.text : ''}</Text>
            <TouchableOpacity style={{ padding: 20 }} onPress={openDatePicker}>
              <Text>Seleccionar fecha</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}


/*

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const addTask = () => {
    if (newTask.trim() !== '') {
      const task = {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        date: new Date(),
      };

      setTasks((prevTasks) => [...prevTasks, task]);
      setNewTask('');
    }
  };

  const removeTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const toggleComplete = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );
  };

  const confirmRemove = (taskId) => {
    setSelectedTask(taskId);
    setModalVisible(true);
  };

  const handleModalClose = (confirmed) => {
    if (confirmed) {
      removeTask(selectedTask);
    }
    setModalVisible(false);
    setSelectedTask(null);
  };

  const handleTaskPress = (taskId) => {
    setSelectedTask(taskId);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Lista de Tareas</Text>
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            paddingHorizontal: 8,
            marginBottom: 8,
          }}
          placeholder="Nueva tarea"
          value={newTask}
          onChangeText={setNewTask}
        />
        <TouchableOpacity onPress={addTask} style={{ backgroundColor: 'blue', padding: 8, borderRadius: 4 }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Agregar tarea</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={{
              marginBottom: 8,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: selectedTask === task.id ? 'blue' : 'gray',
            }}
            onPress={() => handleTaskPress(task.id)}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: task.completed ? 'lightgray' : 'white',
                padding: 8,
                borderRadius: 4,
              }}
            >
              <TouchableOpacity
                onPress={() => toggleComplete(task.id)}
                style={{
                  marginRight: 8,
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: task.completed ? 'green' : 'gray',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {task.completed && <Text style={{ color: 'green', fontWeight: 'bold' }}>✓</Text>}
              </TouchableOpacity>
              <Text style={{ flex: 1, fontSize: 16 }}>{task.title}</Text>
              <TouchableOpacity onPress={() => confirmRemove(task.id)} style={{ marginLeft: 8 }}>
                <Text style={{ color: 'red', fontWeight: 'bold' }}>Eliminar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {toggleComplete(task.id)}} style={{ marginLeft: 8 }}>
                <Text style={{ color: 'blue', fontWeight: 'bold' }}>Completada</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal visible={modalVisible} onRequestClose={() => handleModalClose(false)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, marginBottom: 16 }}>¿Estás seguro de eliminar esta tarea?</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => handleModalClose(false)} style={{ backgroundColor: 'red', padding: 8, borderRadius: 4, marginRight: 8 }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleModalClose(true)} style={{ backgroundColor: 'green', padding: 8, borderRadius: 4 }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Sí</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}


*/