/**
 * SmartKids Learning App - Manage Children Screen
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Modal, SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../styles/colors';
import { authService } from '../../services/authService';

const AVATARS = ['🦁', '🦊', '🐬', '🦋', '🐯', '🐸', '🦄', '🐻', '🐼', '🦅'];
const GRADES = ['K', '1', '2', '3', '4', '5'];

const ManageChildrenScreen = ({ navigation }) => {
  const [children, setChildren] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', grade: 'K', avatar: '🦁', age: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      const result = await authService.getChildren();
      setChildren(result.children || []);
    } catch (e) {
      setChildren([]);
    }
  };

  const openAddModal = () => {
    setEditingChild(null);
    setForm({ firstName: '', lastName: '', grade: 'K', avatar: '🦁', age: '' });
    setModalVisible(true);
  };

  const openEditModal = (child) => {
    setEditingChild(child);
    setForm({
      firstName: child.firstName,
      lastName: child.lastName,
      grade: child.grade,
      avatar: child.avatar || '🦁',
      age: String(child.age || ''),
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.firstName.trim()) {
      Alert.alert('Required', 'Please enter a first name.');
      return;
    }
    setLoading(true);
    try {
      if (editingChild) {
        await authService.updateChild(editingChild._id, form);
      } else {
        await authService.createChild(form);
      }
      await loadChildren();
      setModalVisible(false);
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not save child profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (child) => {
    Alert.alert(
      'Remove Child',
      `Remove ${child.firstName}'s profile? All their data will be lost.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove', style: 'destructive',
          onPress: async () => {
            try {
              await authService.deleteChild(child._id);
              await loadChildren();
            } catch (e) {
              Alert.alert('Error', 'Could not delete child.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={[Colors.accent, Colors.accentDark]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Children</Text>
        <Text style={styles.headerSub}>Add and manage your children's profiles</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Add Child Button */}
        <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
          <Text style={styles.addBtnIcon}>+</Text>
          <Text style={styles.addBtnText}>Add New Child</Text>
        </TouchableOpacity>

        {/* Children List */}
        {children.map((child) => (
          <View key={child._id} style={styles.childCard}>
            <Text style={styles.childAvatar}>{child.avatar || '🧒'}</Text>
            <View style={styles.childInfo}>
              <Text style={styles.childName}>{child.firstName} {child.lastName}</Text>
              <Text style={styles.childDetail}>Grade {child.grade} · Age {child.age || 'N/A'}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => openEditModal(child)}>
              <Text style={styles.editBtnText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(child)}>
              <Text style={styles.deleteBtnText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}

        {children.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>👶</Text>
            <Text style={styles.emptyText}>No children added yet</Text>
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{editingChild ? 'Edit Child' : 'Add Child'}</Text>

            {/* Avatar Picker */}
            <Text style={styles.fieldLabel}>Choose Avatar</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {AVATARS.map((a) => (
                <TouchableOpacity
                  key={a}
                  style={[styles.avatarOption, form.avatar === a && styles.avatarOptionSelected]}
                  onPress={() => setForm(p => ({ ...p, avatar: a }))}
                >
                  <Text style={{ fontSize: 28 }}>{a}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Name Fields */}
            <Text style={styles.fieldLabel}>First Name *</Text>
            <TextInput
              style={styles.input}
              value={form.firstName}
              onChangeText={v => setForm(p => ({ ...p, firstName: v }))}
              placeholder="Child's first name"
              autoCapitalize="words"
            />

            <Text style={styles.fieldLabel}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={form.lastName}
              onChangeText={v => setForm(p => ({ ...p, lastName: v }))}
              placeholder="Child's last name"
              autoCapitalize="words"
            />

            <Text style={styles.fieldLabel}>Grade</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {GRADES.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.gradeOption, form.grade === g && styles.gradeOptionSelected]}
                  onPress={() => setForm(p => ({ ...p, grade: g }))}
                >
                  <Text style={[styles.gradeText, form.grade === g && styles.gradeTextSelected]}>
                    {g === 'K' ? 'K' : `G${g}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.fieldLabel}>Age</Text>
            <TextInput
              style={styles.input}
              value={form.age}
              onChangeText={v => setForm(p => ({ ...p, age: v }))}
              placeholder="Child's age"
              keyboardType="numeric"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
                <Text style={styles.saveText}>{loading ? 'Saving...' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 20, paddingTop: 48 },
  backText: { fontSize: 16, color: Colors.white, fontWeight: '600', marginBottom: 4 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: Colors.white },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  content: { padding: 20, paddingBottom: 40 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.primary, borderRadius: 20,
    padding: 16, marginBottom: 20,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  addBtnIcon: { fontSize: 24, color: Colors.white, fontWeight: '700' },
  addBtnText: { fontSize: 17, fontWeight: '700', color: Colors.white },
  childCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: 20, padding: 16,
    marginBottom: 12, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 3,
  },
  childAvatar: { fontSize: 36 },
  childInfo: { flex: 1 },
  childName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  childDetail: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  editBtn: { padding: 8 },
  editBtnText: { fontSize: 20 },
  deleteBtn: { padding: 8 },
  deleteBtnText: { fontSize: 20 },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyEmoji: { fontSize: 56, marginBottom: 12 },
  emptyText: { fontSize: 16, color: Colors.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: {
    backgroundColor: Colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, maxHeight: '90%',
  },
  modalTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 20, textAlign: 'center' },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
  input: {
    borderWidth: 2, borderColor: Colors.border, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15,
    color: Colors.textPrimary, backgroundColor: Colors.background, marginBottom: 14,
  },
  avatarOption: {
    width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.background, marginRight: 8, borderWidth: 2, borderColor: 'transparent',
  },
  avatarOptionSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  gradeOption: {
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 16,
    backgroundColor: Colors.background, marginRight: 8, borderWidth: 2, borderColor: 'transparent',
  },
  gradeOptionSelected: { borderColor: Colors.accent, backgroundColor: Colors.accentLight },
  gradeText: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  gradeTextSelected: { color: Colors.accent },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, borderRadius: 20, borderWidth: 2, borderColor: Colors.border, paddingVertical: 14, alignItems: 'center' },
  cancelText: { fontSize: 16, fontWeight: '700', color: Colors.textSecondary },
  saveBtn: { flex: 1, borderRadius: 20, backgroundColor: Colors.primary, paddingVertical: 14, alignItems: 'center' },
  saveText: { fontSize: 16, fontWeight: '700', color: Colors.white },
});

export default ManageChildrenScreen;
