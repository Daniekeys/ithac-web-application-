"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const EnrollmentTrendChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "New Enrollments",
        data: [12, 19, 3, 5, 2, 3, 10],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
        text: "Enrollment Trend",
      },
    },
  };

  return <Line options={options} data={data} />;
};

export const CompletionRateChart = ({
  completed,
  active,
}: {
  completed: number;
  active: number;
}) => {
  const data = {
    labels: ["Completed", "Active"],
    datasets: [
      {
        data: [completed, active],
        backgroundColor: ["rgba(34, 197, 94, 0.6)", "rgba(59, 130, 246, 0.6)"],
        borderColor: ["rgba(34, 197, 94, 1)", "rgba(59, 130, 246, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };


  return <Doughnut data={data} options={options} />;
};

export const LessonEngagementChart = () => {
  const data = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Lesson Views",
        data: [65, 59, 80, 81],
        backgroundColor: "rgba(168, 85, 247, 0.5)",
      },
      {
        label: "Completions",
        data: [28, 48, 40, 19],
        backgroundColor: "rgba(34, 197, 94, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return <Bar options={options} data={data} />;
};
