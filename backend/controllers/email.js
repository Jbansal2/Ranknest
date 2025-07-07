const mailSender = require("../utils/email");

exports.sendEmail = async (req, res) => {
  const { email, student } = req.body;

  console.log('Request body:', JSON.stringify(req.body, null, 2));

  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.log('Invalid email:', email);
    return res.status(400).json({ success: false, message: 'Invalid email address.' });
  }

  // Validate student object
  if (!student || !student.enroll_no || !student.name || !student.metrics || !student.branch || !student.batch || !student.selectedSemester) {
    console.log('Invalid student data:', student);
    return res.status(400).json({ success: false, message: 'Invalid student data.' });
  }

  try {
    const semesters = Array.isArray(student.semesters) ? student.semesters : [];
    const subjects = Array.isArray(student.subjects) ? student.subjects : [];
    const m = student.metrics || {};
    const metricsContent = `
      <h3>Summary</h3>
      <p><strong>Marks:</strong> ${m.total_marks || 0} / ${m.max_marks || 1000}</p>
      <p><strong>Percentage:</strong> ${m.percentage || '0.000'}%</p>
      <p><strong>Credit Marks:</strong> ${m.total_credit_marks || 0} / ${m.max_credit_marks || 2600}</p>
      <p><strong>Credit Percentage:</strong> ${m.credit_percentage || '0.000'}%</p>
      <p><strong>SGPA:</strong> ${m.sgpa || '0.000'}</p>
      <p><strong>Credits Obtained:</strong> ${m.total_credits || 0} / ${m.max_credits || 26}</p>
      <p><strong>Rank:</strong> #${student.rank || 'N/A'}${student.rank === 1 ? ' 🏆' : ''}</p>
    `;

    let tableContent = '';

    if (student.selectedSemester === 'OVERALL') {
      if (semesters.length === 0) {
        tableContent = '<p>No semester data available.</p>';
      } else {
        const rows = semesters.map(sem => {
          const metrics = calculateMetrics(sem);
          return `
            <tr>
              <td>${sem.semester_no || 'N/A'}</td>
              <td>${metrics.sgpa}</td>
              <td>${metrics.total_marks} / ${metrics.max_marks}</td>
              <td>${metrics.percentage}%</td>
              <td>${metrics.total_credit_marks} / ${metrics.max_credit_marks}</td>
              <td>${metrics.credit_percentage}%</td>
              <td>${metrics.total_credits} / ${metrics.max_credits}</td>
            </tr>
          `;
        }).join('');

        tableContent = `
          <h3>Semester Summary</h3>
          <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; border-collapse: collapse;">
            <thead style="background-color: #f2f2f2;">
              <tr>
                <th>Semester</th>
                <th>SGPA</th>
                <th>Marks</th>
                <th>Percentage</th>
                <th>Credit Marks</th>
                <th>Credit %</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        `;
      }
    } else {
      if (subjects.length === 0) {
        tableContent = `<p>No subject data available for ${student.selectedSemester}.</p>`;
      } else {
        const rows = subjects.map(subject => {
          if (!subject || typeof subject !== 'object') return '';
          return `
            <tr>
              <td>${subject.paper_id || 'N/A'}</td>
              <td>
                ${subject.name || 'Unknown'} (${subject.credits || 0})
                ${subject.marks < 40 ? '<span style="color: red;"> (Backlog)</span>' : ''}
              </td>
              <td>${subject.minor || 0}</td>
              <td>${subject.major || 0}</td>
              <td>${subject.marks || 0} (${subject.grade || 'N/A'})</td>
            </tr>
          `;
        }).join('');

        tableContent = `
          <h3>Subject Details</h3>
          <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; border-collapse: collapse;">
            <thead style="background-color: #f2f2f2;">
              <tr>
                <th>Paper ID</th>
                <th>Subject (Credits)</th>
                <th>Int.</th>
                <th>Ext.</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        `;
      }
    }

    // Final email content
    const emailContent = `
      <h2>Dear ${student.name},</h2>
      <p>Here is your academic result for <strong>${student.branch}</strong>, Batch <strong>${student.batch}</strong>, <strong>${student.selectedSemester}</strong>.</p>
      <h3>Student Details</h3>
      <p><strong>Enrollment Number:</strong> ${student.enroll_no}</p>
      <p><strong>Name:</strong> ${student.name}</p>
      ${metricsContent}
      ${tableContent}
      <p>Best regards,<br><strong>Rankify</strong></p>
    `;

    console.log('Sending email to:', email);
    const info = await mailSender(
      email,
      `Your Academic Result - ${student.enroll_no} (${student.selectedSemester})`,
      emailContent
    );

    if (!info) {
      console.error('mailSender returned no info');
      throw new Error('Failed to send email.');
    }

    console.log('Email sent:', info);
    return res.status(200).json({ success: true, message: 'Email sent successfully.' });

  } catch (error) {
    console.error('Error sending email:', error.message, error.stack);
    return res.status(500).json({ success: false, message: `Failed to send email: ${error.message}` });
  }
};

// Refactored metrics calculator
const calculateMetrics = (sem = {}) => {
  const total_marks = sem.total_marks || 0;
  const max_marks = sem.max_marks || 1000;
  const total_credit_marks = sem.total_credit_marks || 0;
  const max_credit_marks = sem.max_credit_marks || 2600;

  return {
    sgpa: sem.sgpa || '0.000',
    percentage: ((total_marks / max_marks) * 100).toFixed(3),
    credit_percentage: ((total_credit_marks / max_credit_marks) * 100).toFixed(3),
    total_marks,
    max_marks,
    total_credit_marks,
    max_credit_marks,
    total_credits: sem.total_credits || 0,
    max_credits: sem.max_credits || 26
  };
};
