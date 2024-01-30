const { dialog } = require('electron');

function showRoleDialog() {
  const options = {
    type: 'info',
    title: 'Select Role',
    message: 'Please select to proceed:',
    buttons: ['I\'m a Student', 'I\'m a Teacher'],
  };

  const result = dialog.showMessageBoxSync(options);

  return result === 0 ? 'student' : 'teacher';
}

module.exports = { showRoleDialog };
