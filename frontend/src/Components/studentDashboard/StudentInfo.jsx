import React from "react";
import { User, Building2, GraduationCap, GitBranch } from "lucide-react";
import instituteConfig from "../../data/instituteConfig.json"; 

const StudentInfo = ({ studentData = {} }) => {
  const { branchMap, courseMap, instituteMap } = instituteConfig;

  const cards = [
    {
      icon: User,
      title: "Student Details",
      items: [
        { label: "SID", value: studentData.sid || "N/A" },
        { label: "Scheme", value: studentData.scheme_id || "N/A" },
      ],
    },
    {
      icon: Building2,
      title: "Institute",
      items: [
        {
          label: "Name",
          value:
            instituteMap[studentData.insti_code] ||
            studentData.institute_name ||
            "N/A",
        },
        {
          label: "Code",
          value: studentData.insti_code || "N/A",
        },
      ],
    },
    {
      icon: GraduationCap,
      title: "Programme",
      items: [
        {
          label: "Name",
          value:
            courseMap[studentData.course_code] ||
            branchMap[studentData.branch_code] ||
            studentData.course_name ||
            "Unknown Course",
        },
        {
          label: "Code",
          value: studentData.course_code || studentData.branch_code || "N/A",
        },
      ],
    },
    {
      icon: GitBranch,
      title: "Branch",
      items: [
        {
          label: "Name",
          value:
            branchMap[studentData.branch_code] ||
            studentData.branch_name ||
            "N/A",
        },
        {
          label: "Code",
          value: studentData.branch_code || studentData.course_code || "N/A",
        },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="group relative bg-black border-2 border-zinc-800 rounded-xl p-3 cursor-pointer transform transition-all duration-300 hover:border-white/30"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-zinc-900 border border-zinc-700 rounded-lg group-hover:bg-white/10 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-white">{card.title}</h3>
              </div>
              <div className="space-y-4">
                {card.items.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-white font-medium leading-relaxed break-words">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StudentInfo;