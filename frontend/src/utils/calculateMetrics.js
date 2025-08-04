export const calculateMetrics = (semesters, semesterType) => {
  if (!Array.isArray(semesters)) return semesterType === "all" ? [] : {};

  if (semesterType === "OVERALL") {
    let total_marks = 0,
      max_marks = 0,
      total_credits = 0,
      max_credits = 0,
      total_credit_marks = 0,
      max_credit_marks = 0,
      weighted_sgpa = 0,
      total_valid_semesters = 0;

    semesters.forEach((sem) => {
      const sem_marks = parseInt(sem.total_marks) || 0;
      const sem_max_marks = parseInt(sem.max_marks) || 0;
      const sem_credits = parseInt(sem.total_credits) || 0;
      const sem_max_credits = parseInt(sem.max_credits) || 0;
      const sem_credit_marks = parseInt(sem.total_credit_marks) || 0;
      const sem_max_credit_marks = parseInt(sem.max_credit_marks) || 0;
      const sem_sgpa = parseFloat(sem.sgpa) || 0;

      total_marks += sem_marks;
      max_marks += sem_max_marks;
      total_credits += sem_credits;
      max_credits += sem_max_credits;
      total_credit_marks += sem_credit_marks;
      max_credit_marks += sem_max_credit_marks;

      if (sem_credits > 0) {
        weighted_sgpa += sem_sgpa * sem_credits;
        total_valid_semesters += sem_credits;
      }
    });

    const percentage =
      max_marks > 0 ? ((total_marks / max_marks) * 100).toFixed(3) : "0.000";
    const credit_percentage =
      max_credit_marks > 0
        ? ((total_credit_marks / max_credit_marks) * 100).toFixed(3)
        : "0.000";
    const sgpa =
      total_valid_semesters > 0
        ? (weighted_sgpa / total_valid_semesters).toFixed(3)
        : "0.000";

    return {
      total_marks,
      max_marks,
      sgpa,
      total_credits,
      max_credits,
      total_credit_marks,
      max_credit_marks,
      percentage,
      credit_percentage,
    };
  } else if (semesterType === "all") {
    return semesters.map((semester) => ({
      semester_no: semester.semester_no || `SEM-${semester.semester_no}`,
      metrics: {
        total_marks: parseInt(semester.total_marks) || 0,
        max_marks: parseInt(semester.max_marks) || 1200,
        sgpa: semester.sgpa || "0.000",
        total_credits: parseInt(semester.total_credits) || 0,
        max_credits: parseInt(semester.max_credits) || 26,
        total_credit_marks: parseInt(semester.total_credit_marks) || 0,
        max_credit_marks: parseInt(semester.max_credit_marks) || 2600,
        percentage: semester.percentage || "0.000",
        credit_percentage: semester.credit_percentage || "0.000",
      },
      subjects: (semester.subjects || []).map((sub) => ({
        paper_id: sub.subject_code,
        name: sub.subject_name,
        credits: sub.credits,
        minor: sub.minor,
        major: sub.major,
        marks: sub.marks,
        grade: sub.grade,
        is_back: sub.is_back,
        semester: `SEM-${semester.semester_no}`,
      })),
    }));
  } else {
    const semester = semesters.find((sem) => sem.semester_no === semesterType);
    return semester
      ? {
          total_marks: parseInt(semester.total_marks) || 0,
          max_marks: parseInt(semester.max_marks) || 1200,
          sgpa: semester.sgpa || "0.000",
          total_credits: parseInt(semester.total_credits) || 0,
          max_credits: parseInt(semester.max_credits) || 26,
          total_credit_marks: parseInt(semester.total_credit_marks) || 0,
          max_credit_marks: parseInt(semester.max_credit_marks) || 2600,
          percentage: semester.percentage || "0.000",
          credit_percentage: semester.credit_percentage || "0.000",
        }
      : {
          total_marks: 0,
          max_marks: 1200,
          sgpa: "0.000",
          total_credits: 0,
          max_credits: 26,
          total_credit_marks: 0,
          max_credit_marks: 2600,
          percentage: "0.000",
          credit_percentage: "0.000",
        };
  }
};

export const calculateOverallMetrics = (semesters) => {
  if (!semesters || semesters.length === 0) {
    return {
      total_marks: 0,
      max_marks: 0,
      percentage: "0.000",
      sgpa: "0.000",
      total_credit_marks: 0,
      max_credit_marks: 0,
      credit_percentage: "0.000",
      total_credits: 0,
      max_credits: 0,
    };
  }

  const totals = semesters.reduce(
    (acc, sem) => {
      acc.total_marks += parseInt(sem.total_marks) || 0;
      acc.max_marks += parseInt(sem.max_marks) || 0;
      acc.total_credit_marks += parseInt(sem.total_credit_marks) || 0;
      acc.max_credit_marks += parseInt(sem.max_credit_marks) || 0;
      acc.total_credits += parseInt(sem.total_credits) || 0;
      acc.max_credits += parseInt(sem.max_credits) || 0;
      return acc;
    },
    {
      total_marks: 0,
      max_marks: 0,
      total_credit_marks: 0,
      max_credit_marks: 0,
      total_credits: 0,
      max_credits: 0,
    }
  );

  const percentage =
    totals.max_marks > 0
      ? ((totals.total_marks / totals.max_marks) * 100).toFixed(3)
      : "0.000";

  const creditPercentage =
    totals.max_credit_marks > 0
      ? ((totals.total_credit_marks / totals.max_credit_marks) * 100).toFixed(3)
      : "0.000";

  const validSgpas = semesters
    .map((sem) => parseFloat(sem.sgpa))
    .filter((sgpa) => !isNaN(sgpa) && sgpa > 0);

  const cgpa =
    validSgpas.length > 0
      ? (
          validSgpas.reduce((sum, sgpa) => sum + sgpa, 0) / validSgpas.length
        ).toFixed(3)
      : "0.000";

  return {
    total_marks: totals.total_marks,
    max_marks: totals.max_marks,
    percentage,
    sgpa: cgpa,
    total_credit_marks: totals.total_credit_marks,
    max_credit_marks: totals.max_credit_marks,
    credit_percentage: creditPercentage,
    total_credits: totals.total_credits,
    max_credits: totals.max_credits,
  };
};
