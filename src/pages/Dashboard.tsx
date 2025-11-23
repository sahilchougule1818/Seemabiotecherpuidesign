import { Card } from "../components/ui/card";
import { StatsCard } from "../components/common/StatsCard";
import { Layers, Sprout, FlaskConical, TreePine, TrendingUp, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";

export function Dashboard() {
  const overallStats = [
    { title: "Indoor Batches", value: "156", icon: Layers, trend: { value: "+12 this month", isPositive: true } },
    { title: "Outdoor Batches", value: "56", icon: Sprout, trend: { value: "+8 this week", isPositive: true } },
    { title: "Total Plants", value: "21,080", icon: TreePine, trend: { value: "+15% vs last month", isPositive: true } },
    { title: "Active Issues", value: "7", icon: AlertTriangle },
  ];

  const productionData = [
    { month: "Jul", indoor: 145, outdoor: 48 },
    { month: "Aug", indoor: 152, outdoor: 52 },
    { month: "Sep", indoor: 148, outdoor: 50 },
    { month: "Oct", indoor: 160, outdoor: 54 },
    { month: "Nov", indoor: 156, outdoor: 56 },
  ];

  const cropDistribution = [
    { crop: "Banana", count: 8500 },
    { crop: "Bamboo", count: 5200 },
    { crop: "Teak", count: 4380 },
    { crop: "Ornamental", count: 3000 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Dashboard</h1>
          <p className="text-[#717182] mt-1">Welcome back! Here's an overview of your biotech operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">This Week</Button>
          <Button variant="outline">This Month</Button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overallStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Trend */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
          <h3 className="mb-4">Production Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="month" stroke="#555555" />
              <YAxis stroke="#555555" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "white", 
                  border: "1px solid #E0E0E0",
                  borderRadius: "8px" 
                }} 
              />
              <Legend />
              <Line type="monotone" dataKey="indoor" stroke="#4CAF50" name="Indoor Batches" strokeWidth={2} />
              <Line type="monotone" dataKey="outdoor" stroke="#81C784" name="Outdoor Batches" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Crop Distribution */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
          <h3 className="mb-4">Crop Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={cropDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="crop" stroke="#555555" />
              <YAxis stroke="#555555" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "white", 
                  border: "1px solid #E0E0E0",
                  borderRadius: "8px" 
                }} 
              />
              <Bar dataKey="count" fill="#4CAF50" name="Plant Count" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick Access Modules */}
      <div>
        <h2 className="mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Indoor Module Card */}
          <Card className="p-6 bg-gradient-to-br from-white to-[#F3FFF4] border-border/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#4CAF50]/20 to-[#4CAF50]/10">
                <FlaskConical className="w-6 h-6 text-[#4CAF50]" />
              </div>
              <div>
                <h3>Indoor Module</h3>
                <p className="text-sm text-[#717182]">Laboratory operations</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-white/50 rounded-lg">
                <p className="text-sm text-[#717182]">Media Prep</p>
                <p>48 batches</p>
              </div>
              <div className="p-3 bg-white/50 rounded-lg">
                <p className="text-sm text-[#717182]">Subcultures</p>
                <p>156 active</p>
              </div>
              <div className="p-3 bg-white/50 rounded-lg">
                <p className="text-sm text-[#717182]">Incubation</p>
                <p>89 in progress</p>
              </div>
              <div className="p-3 bg-white/50 rounded-lg">
                <p className="text-sm text-[#717182]">Sampling</p>
                <p>124 samples</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/indoor/media-preparation" className="flex-1">
                <Button className="w-full bg-[#4CAF50] hover:bg-[#45a049]">
                  View Details
                </Button>
              </Link>
            </div>
          </Card>

          {/* Outdoor Module Card */}
          <Card className="p-6 bg-gradient-to-br from-white to-[#F3FFF4] border-border/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#4CAF50]/20 to-[#4CAF50]/10">
                <TreePine className="w-6 h-6 text-[#4CAF50]" />
              </div>
              <div>
                <h3>Outdoor Module</h3>
                <p className="text-sm text-[#717182]">Field operations</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-white/50 rounded-lg">
                <p className="text-sm text-[#717182]">Primary</p>
                <p>32 batches</p>
              </div>
              <div className="p-3 bg-white/50 rounded-lg">
                <p className="text-sm text-[#717182]">Secondary</p>
                <p>24 batches</p>
              </div>
              <div className="p-3 bg-white/50 rounded-lg">
                <p className="text-sm text-[#717182]">Holding</p>
                <p>12,540 plants</p>
              </div>
              <div className="p-3 bg-white/50 rounded-lg">
                <p className="text-sm text-[#717182]">Mortality</p>
                <p>3.2% rate</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/outdoor/primary-hardening" className="flex-1">
                <Button className="w-full bg-[#4CAF50] hover:bg-[#45a049]">
                  View Details
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Alerts */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-border/50">
        <h3 className="mb-4">Recent Alerts & Notifications</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-[#FFF3E0] rounded-lg border-l-4 border-[#FFC107]">
            <AlertTriangle className="w-5 h-5 text-[#FFC107] mt-0.5" />
            <div className="flex-1">
              <p>High mortality rate detected in Teak batch PH-2024-003</p>
              <p className="text-sm text-[#717182] mt-1">2 hours ago • Outdoor Module</p>
            </div>
            <Button variant="outline" size="sm">Review</Button>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[#FFEBEE] rounded-lg border-l-4 border-[#d4183d]">
            <AlertTriangle className="w-5 h-5 text-[#d4183d] mt-0.5" />
            <div className="flex-1">
              <p>Contamination detected in media batch MB-2024-004</p>
              <p className="text-sm text-[#717182] mt-1">5 hours ago • Indoor Module</p>
            </div>
            <Button variant="outline" size="sm">Review</Button>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[#E8F5E9] rounded-lg border-l-4 border-[#4CAF50]">
            <TrendingUp className="w-5 h-5 text-[#4CAF50] mt-0.5" />
            <div className="flex-1">
              <p>Production target achieved - 8,200 plants ready for dispatch</p>
              <p className="text-sm text-[#717182] mt-1">1 day ago • Outdoor Module</p>
            </div>
            <Button variant="outline" size="sm">View</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
