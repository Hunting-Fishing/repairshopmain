export const getProficiencyColor = (level: number) => {
  switch (level) {
    case 1: return "bg-red-100 text-red-800";
    case 2: return "bg-orange-100 text-orange-800";
    case 3: return "bg-yellow-100 text-yellow-800";
    case 4: return "bg-green-100 text-green-800";
    case 5: return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export const getProficiencyLabel = (level: number) => {
  switch (level) {
    case 1: return "Beginner";
    case 2: return "Advanced Beginner";
    case 3: return "Competent";
    case 4: return "Proficient";
    case 5: return "Expert";
    default: return "Unknown";
  }
};