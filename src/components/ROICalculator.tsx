import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { 
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Calculator,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface ROICalculatorProps {
  onStartTrial?: () => void;
}

export function ROICalculator({ onStartTrial }: ROICalculatorProps) {
  const [billsPerDay, setBillsPerDay] = useState(50);
  const [timePerBill, setTimePerBill] = useState(5); // minutes
  const [employeeCost, setEmployeeCost] = useState(15000); // monthly
  const [avgBillValue, setAvgBillValue] = useState(300);
  const [missedSales, setMissedSales] = useState(10); // percentage

  const [results, setResults] = useState({
    timeSaved: 0,
    moneySaved: 0,
    extraRevenue: 0,
    totalBenefit: 0,
    roi: 0,
    paybackPeriod: 0
  });

  useEffect(() => {
    calculateROI();
  }, [billsPerDay, timePerBill, employeeCost, avgBillValue, missedSales]);

  const calculateROI = () => {
    // Time saved calculation
    const currentTimePerMonth = billsPerDay * timePerBill * 30; // in minutes
    const newTimePerMonth = billsPerDay * 0.5 * 30; // 30 seconds per bill with voice
    const timeSavedMinutes = currentTimePerMonth - newTimePerMonth;
    const timeSavedHours = timeSavedMinutes / 60;

    // Money saved on labor
    const laborCostPerHour = employeeCost / (30 * 8); // assuming 8 hour days
    const moneySaved = timeSavedHours * laborCostPerHour;

    // Extra revenue from reduced wait time
    const currentMissedSalesValue = (billsPerDay * 30 * avgBillValue * missedSales) / 100;
    const newMissedSalesValue = currentMissedSalesValue * 0.3; // 70% reduction in missed sales
    const extraRevenue = currentMissedSalesValue - newMissedSalesValue;

    // Total benefit
    const totalBenefit = moneySaved + extraRevenue;

    // ROI calculation (Pro plan at ₹299/month)
    const monthlyCost = 299;
    const roi = ((totalBenefit - monthlyCost) / monthlyCost) * 100;
    const paybackPeriod = monthlyCost / (totalBenefit / 30); // in days

    setResults({
      timeSaved: Math.round(timeSavedHours),
      moneySaved: Math.round(moneySaved),
      extraRevenue: Math.round(extraRevenue),
      totalBenefit: Math.round(totalBenefit),
      roi: Math.round(roi),
      paybackPeriod: Math.round(paybackPeriod)
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge className="bg-green-100 text-green-700 border-green-200 mb-4">
          <Calculator className="w-3 h-3 mr-1" />
          ROI Calculator
        </Badge>
        <h2 className="text-3xl md:text-5xl mb-4 text-gray-900">
          Calculate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]">Savings</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Dekho kitna time aur paisa bach sakta hai. Real numbers, real savings!
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Input Controls */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl mb-6 text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Your Current Situation
            </h3>

            {/* Bills per day */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Bills Per Day
                </Label>
                <Badge variant="outline" className="font-mono">
                  {billsPerDay} bills
                </Badge>
              </div>
              <Slider
                value={[billsPerDay]}
                onValueChange={(value) => setBillsPerDay(value[0])}
                min={10}
                max={200}
                step={10}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>10</span>
                <span>200</span>
              </div>
            </div>

            {/* Time per bill */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time Per Bill (Manual)
                </Label>
                <Badge variant="outline" className="font-mono">
                  {timePerBill} min
                </Badge>
              </div>
              <Slider
                value={[timePerBill]}
                onValueChange={(value) => setTimePerBill(value[0])}
                min={2}
                max={10}
                step={0.5}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>2 min</span>
                <span>10 min</span>
              </div>
            </div>

            {/* Employee cost */}
            <div className="mb-6">
              <Label className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4" />
                Monthly Employee Cost
              </Label>
              <Input
                type="number"
                value={employeeCost}
                onChange={(e) => setEmployeeCost(Number(e.target.value))}
                placeholder="15000"
                className="font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Average salary of person handling billing
              </p>
            </div>

            {/* Average bill value */}
            <div className="mb-6">
              <Label className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4" />
                Average Bill Value
              </Label>
              <Input
                type="number"
                value={avgBillValue}
                onChange={(e) => setAvgBillValue(Number(e.target.value))}
                placeholder="300"
                className="font-mono"
              />
            </div>

            {/* Missed sales percentage */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Missed Sales (due to slow billing)
                </Label>
                <Badge variant="outline" className="font-mono">
                  {missedSales}%
                </Badge>
              </div>
              <Slider
                value={[missedSales]}
                onValueChange={(value) => setMissedSales(value[0])}
                min={0}
                max={30}
                step={5}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>30%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Customers who leave due to long wait times
              </p>
            </div>
          </Card>

          {/* Comparison */}
          <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200">
            <h4 className="text-lg mb-4 text-gray-900">Current vs With Retail Bandhu</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Time per bill</span>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-red-100 border-red-200">
                    {timePerBill} min
                  </Badge>
                  <span className="text-gray-400">→</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    30 sec
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Daily billing time</span>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-red-100 border-red-200">
                    {Math.round((billsPerDay * timePerBill) / 60)}h
                  </Badge>
                  <span className="text-gray-400">→</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    {Math.round((billsPerDay * 0.5) / 60)}h
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Missed sales</span>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-red-100 border-red-200">
                    {missedSales}%
                  </Badge>
                  <span className="text-gray-400">→</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    {Math.round(missedSales * 0.3)}%
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Results */}
        <div className="space-y-6">
          {/* Main Results */}
          <Card className="p-8 bg-gradient-to-br from-[#1E88E5] to-[#FF6F00] text-white">
            <h3 className="text-2xl mb-6">Your Monthly Savings 💰</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <Clock className="w-6 h-6 mb-2" />
                <div className="text-3xl mb-1">{results.timeSaved}h</div>
                <div className="text-sm text-white/80">Time Saved</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <DollarSign className="w-6 h-6 mb-2" />
                <div className="text-3xl mb-1">₹{results.moneySaved.toLocaleString()}</div>
                <div className="text-sm text-white/80">Labor Cost Saved</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <TrendingUp className="w-6 h-6 mb-2" />
                <div className="text-3xl mb-1">₹{results.extraRevenue.toLocaleString()}</div>
                <div className="text-sm text-white/80">Extra Revenue</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <Sparkles className="w-6 h-6 mb-2" />
                <div className="text-3xl mb-1">₹{results.totalBenefit.toLocaleString()}</div>
                <div className="text-sm text-white/80">Total Benefit</div>
              </div>
            </div>

            <div className="border-t border-white/20 pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80">Pro Plan Cost</span>
                <span className="text-2xl">₹299/mo</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/80">Your ROI</span>
                <span className="text-3xl">{results.roi}%</span>
              </div>
              <Badge className="bg-white text-blue-600 w-full justify-center py-2">
                Payback in just {results.paybackPeriod} days!
              </Badge>
            </div>
          </Card>

          {/* Breakdown */}
          <Card className="p-6">
            <h4 className="text-lg mb-4 text-gray-900">Annual Impact</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Total Annual Savings</span>
                <span className="text-xl text-green-600">
                  ₹{(results.totalBenefit * 12).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Annual Cost (Pro Plan)</span>
                <span className="text-xl text-blue-600">₹3,588</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                <span className="text-gray-900">Net Annual Benefit</span>
                <span className="text-2xl text-purple-600">
                  ₹{((results.totalBenefit * 12) - 3588).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Additional Benefits */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-orange-50 border-2 border-blue-200">
            <h4 className="text-lg mb-4 text-gray-900">Plus, You Also Get:</h4>
            <ul className="space-y-2">
              {[
                'Happy customers (no wait time)',
                'Professional digital bills',
                'Automatic inventory tracking',
                'GST-ready reports',
                'WhatsApp automation',
                'Business insights & analytics'
              ].map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </Card>

          {/* CTA */}
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-lg"
            onClick={onStartTrial}
          >
            Start Saving Now - Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <p className="text-sm text-center text-gray-600">
            Join 5000+ retailers who are already saving ₹{results.totalBenefit.toLocaleString()}/month
          </p>
        </div>
      </div>

      {/* Bottom Info */}
      <Card className="mt-12 p-6 bg-yellow-50 border-2 border-yellow-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center flex-shrink-0">
            💡
          </div>
          <div>
            <h4 className="mb-2 text-gray-900">This calculation is conservative!</h4>
            <p className="text-sm text-gray-700">
              Most retailers report even higher savings due to reduced errors, better inventory control, 
              and increased customer satisfaction leading to repeat business. Your actual ROI could be 
              much higher!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
