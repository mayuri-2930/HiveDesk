// Helper function to transform API employee data to match component format
export const transformEmployeeData = (apiEmployees) => {
  if (!apiEmployees || !Array.isArray(apiEmployees)) return [];
  
  return apiEmployees.map(employee => ({
    id: employee.id || employee.employee_id,
    name: employee.name || 'Unknown Employee',
    email: employee.email || 'No email',
    department: employee.department || 'General',
    position: employee.position || employee.role || 'Employee',
    status: employee.is_active ? 'Active' : 'Inactive',
    progress: employee.completion_rate || 0,
    total_tasks: employee.total_tasks || 0,
    completed_tasks: employee.completed_tasks || 0,
    is_active: employee.is_active || false
  }));
};

// Helper function to transform API task data
export const transformTaskData = (apiTasks) => {
  if (!apiTasks || !Array.isArray(apiTasks)) return [];
  
  if (typeof apiTasks[0] === 'string') {
    try {
      return apiTasks.map((taskString, index) => {
        return {
          id: index + 1,
          title: taskString,
          assigned_to: 'Unknown',
          due_date: 'N/A',
          status: 'pending'
        };
      });
    } catch (error) {
      console.error('Error parsing task strings:', error);
      return [];
    }
  }
  
  return apiTasks.map(task => ({
    id: task.id || task.task_id,
    title: task.title || task.name || 'Unnamed Task',
    assigned_to: task.assigned_to || task.assigned_employee || 'Unassigned',
    due_date: task.due_date || task.deadline || 'No deadline',
    status: task.status || 'pending',
    description: task.description || '',
    priority: task.priority || 'medium'
  }));
};

// Helper function to transform API document data
export const transformDocumentData = (apiDocuments) => {
  if (!apiDocuments || !Array.isArray(apiDocuments)) return [];
  
  if (typeof apiDocuments[0] === 'string') {
    try {
      return apiDocuments.map((docString, index) => {
        const filename = docString.split('/').pop() || docString;
        return {
          id: index + 1,
          name: filename,
          type: filename.split('.').pop() || 'file',
          uploaded_by: 'Unknown',
          uploaded_at: 'Recently',
          size: 'Unknown',
          url: docString
        };
      });
    } catch (error) {
      console.error('Error parsing document strings:', error);
      return [];
    }
  }
  
  return apiDocuments.map(doc => ({
    id: doc.id || doc.document_id,
    name: doc.name || doc.filename || 'Unnamed Document',
    type: doc.type || doc.file_type || 'file',
    uploaded_by: doc.uploaded_by || doc.uploader || 'Unknown',
    uploaded_at: doc.uploaded_at || doc.created_at || 'Recently',
    size: doc.size || 'Unknown',
    url: doc.url || doc.file_url || '#'
  }));
};