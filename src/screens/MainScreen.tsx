import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  TextInput,
  Animated,
  Platform,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
}

interface MainScreenProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  isDarkMode: boolean;
}

export default function MainScreen({ tasks, setTasks, isDarkMode }: MainScreenProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const pendingCount = tasks.filter(task => !task.completed).length;


  // Open modal for creating or editing
  const openModalForTask = (task?: Task) => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setDueDate(task?.dueDate ? new Date(task.dueDate) : null);
    setEditingTaskId(task?.id ?? null);
    setModalVisible(true);
  };

  // Save Task (create or update)
  const handleSave = () => {
    if (!title.trim()) return;

    if (editingTaskId) {
      // Update existing task
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTaskId
            ? { ...task, title, description, dueDate: dueDate?.toISOString() }
            : task
        )
      );
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        description,
        dueDate: dueDate?.toISOString(),
        completed: false,
      };
      setTasks((prev) => [...prev, newTask]);
    }

    // Reset modal
    setTitle("");
    setDescription("");
    setDueDate(null);
    setEditingTaskId(null);
    setModalVisible(false);
  };

  // Delete Task
  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    id: string
  ) => (
    <Pressable style={styles.deleteButton} onPress={() => handleDelete(id)}>
      <Text style={styles.deleteText}>Delete</Text>
    </Pressable>
  );

  return (
    <View 
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#000" : "#f5f5f5" },
      ]}
    >
      <Text  style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>My Tasks</Text>
      <Text style={[styles.pending, { color: isDarkMode ? "#bbb" : "#333" }]}>
        {pendingCount === 0
          ? "You're task free!"
          : `${pendingCount} pending ${pendingCount === 1 ? "task" : "tasks"}`}
      </Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={(progress, dragX) =>
              renderRightActions(progress, dragX, item.id)
            }
          >
            <View style={styles.taskRow}>
              {/* Rounded Checkbox */}
              <Pressable
                style={[
                    styles.checkbox,
                    item.completed && styles.checkboxChecked,
                    { borderColor: isDarkMode ? "#aaa" : "#888" },
                  ]}
                onPress={() =>
                  setTasks((prev) =>
                    prev.map((t) =>
                      t.id === item.id ? { ...t, completed: !t.completed } : t
                    )
                  )
                }
              >
                {item.completed && <View style={styles.checkboxInner} />}
              </Pressable>

              {/* Task Info */}
              <Pressable style={styles.taskCardPressable} onPress={() => openModalForTask(item)}>
                <View 
                   style={[
                    styles.taskCard,
                    {
                      backgroundColor: isDarkMode ? "#1c1c1e" : "#ffffffff",
                      shadowColor: isDarkMode ? "#000" : "#888",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.taskTitle,
                      { color: isDarkMode ? "#fff" : "#000" },
                      item.completed && styles.completed,
                    ]}
                  >
                    {item.title}
                  </Text>
                  {item.description && 
                    <Text style={[styles.description, { color: isDarkMode ? "#aaa" : "#555" }]}>
                      {item.description}
                    </Text>
                  }
                  <Text style={[styles.due, { color: isDarkMode ? "#888" : "#888" }]}>
                    Due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "Not set"}
                  </Text>
                </View>
              </Pressable>
            </View>
          </Swipeable>
        )}
        ListEmptyComponent={
          <Text style={{ color: "gray", marginTop: 20 }}>No tasks yet.</Text>
        }
      />

      {/* Floating Action Button */}
      <Pressable style={styles.fab} onPress={() => openModalForTask()}>
        <Text style={styles.fabText}>＋</Text>
      </Pressable>

      {/* Modal */}
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        transparent={false}
      >
        <View 
           style={[
            styles.modalContainer,
            { backgroundColor: isDarkMode ? "#000" : "#fff" },
          ]}
        >
          <Text
            style={[
              styles.modalTitle,
              { color: isDarkMode ? "#fff" : "#000" },
            ]}
          >
            {editingTaskId ? "Edit Task" : "Create Task"}
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode ? "#1c1c1e" : "#fff",
                color: isDarkMode ? "#fff" : "#000",
                borderColor: isDarkMode ? "#333" : "#ccc",
              },
            ]}
            placeholder="Task title *"
            placeholderTextColor={isDarkMode ? "#999" : "#888"}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={[
              styles.input,
              {
                height: 100,
                backgroundColor: isDarkMode ? "#1c1c1e" : "#fff",
                color: isDarkMode ? "#fff" : "#000",
                borderColor: isDarkMode ? "#333" : "#ccc",
              },
            ]}
            placeholder="Description (optional)"
             placeholderTextColor={isDarkMode ? "#999" : "#888"}
            value={description}
            onChangeText={setDescription}
            multiline
          />

          {/* Due Date */}
          <View style={{ marginBottom: 15 }}>
            <Text style={{ marginBottom: 6, color: isDarkMode ? "#ccc" : "#000" }}>Due Date</Text>
            <Pressable
              style={[
                styles.input,
                {
                  justifyContent: "center",
                  backgroundColor: isDarkMode ? "#1c1c1e" : "#fff",
                  borderColor: isDarkMode ? "#333" : "#ccc",
                },
              ]}
              onPress={() => setDatePickerVisible(true)}
            >
              <Text style={{ color: dueDate ? (isDarkMode ? "#fff" : "#000") : "#888" }}>
                {dueDate ? dueDate.toLocaleDateString() : "Not set"}
              </Text>
            </Pressable>

            {/* iOS Spinner */}
            {Platform.OS === "ios" && isDatePickerVisible && (
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  backgroundColor: isDarkMode ? "#1c1c1e" : "#fff",
                  borderColor: isDarkMode ? "#333" : "#ccc",
                  justifyContent: "center",
                }}
              >
                <DateTimePicker
                  value={dueDate ?? new Date()}
                  mode="date"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) setDueDate(selectedDate);
                  }}
                  style={{ width: "100%", height: "100%" }}
                  themeVariant={isDarkMode ? "dark" : "light"}
                />
                <Pressable
                  style={{ alignSelf: "flex-end", padding: 10 }}
                  onPress={() => setDatePickerVisible(false)}
                >
                  <Text style={{ color: "#007AFF", fontWeight: "600", fontSize: 16 }}>Done</Text>
                </Pressable>
              </View>
            )}

            {/* Android Modal */}
            {Platform.OS !== "ios" && (
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                date={dueDate ?? new Date()}
                onConfirm={(date) => {
                  setDueDate(date);
                  setDatePickerVisible(false);
                }}
                onCancel={() => setDatePickerVisible(false)}
              />
            )}
          </View>

          {/* Save & Cancel */}
          <Pressable
            style={[
              styles.saveButton,
              !title.trim() && styles.disabledButton,
              { backgroundColor: isDarkMode ? "#0A84FF" : "#007AFF" },
            ]}
            onPress={handleSave}
            disabled={!title.trim()}
          >
            <Text style={styles.saveButtonText}>Save Task</Text>
          </Pressable>

          <Pressable
            style={styles.cancelButton}
            onPress={() => setModalVisible(false)}
          >
            <Text      
              style={[
                styles.cancelText,
                { color: isDarkMode ? "#0A84FF" : "#007AFF" },
              ]}>
            Cancel
          </Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16},
  title: { fontSize: 24, fontWeight: "bold", top: 20, left: 5, marginBottom: 25 },
  pending:  { fontSize: 15, fontWeight: "thin", left: 5, marginBottom: 25 },
  taskCard: {
    // backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 4,
  },
  taskTitle: { fontSize: 18, fontWeight: "600" },
  completed: { textDecorationLine: "line-through", opacity: 0.3 },
  description: { fontSize: 14, marginTop: 4 },
  due: { fontSize: 12, marginTop: 6 },
  deleteButton: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "flex-end",
    borderRadius: 10,
    marginBottom: 10,
    paddingRight: 20,
    width: 100,
  },
  deleteText: { color: "white", fontWeight: "600" },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  fabText: { color: "white", fontSize: 32, marginTop: -3 },
  modalContainer: { flex: 1, padding: 20, justifyContent: "center" },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12, marginBottom: 15, fontSize: 16 },
  saveButton: { backgroundColor: "#007AFF", padding: 14, borderRadius: 10, top: 160, alignItems: "center" },
  saveButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
  disabledButton: { backgroundColor: "#ccc" },
  cancelButton: { marginTop: 10, alignItems: "center", top: 160,},
  cancelText: { color: "#007AFF", fontSize: 16 },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#888", // grey border
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: "#007AFF",
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "white",
  },
  taskCardPressable: {
    flex: 1,
  },
});
