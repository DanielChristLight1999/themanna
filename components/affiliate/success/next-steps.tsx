"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, UserCheck, Zap } from "lucide-react"

const steps = [
  {
    icon: CheckCircle,
    title: "Application Received",
    description: "Your application has been successfully submitted and logged in our system.",
    status: "completed",
    timeframe: "Just now",
  },
  {
    icon: Clock,
    title: "Under Review",
    description: "Our team is currently reviewing your application and credentials.",
    status: "current",
    timeframe: "24-48 hours",
  },
  {
    icon: UserCheck,
    title: "Approval Decision",
    description: "You'll receive an email with our decision and next steps.",
    status: "pending",
    timeframe: "2-3 business days",
  },
  {
    icon: Zap,
    title: "Account Activation",
    description: "Once approved, you'll get access to your affiliate dashboard and marketing materials.",
    status: "pending",
    timeframe: "Upon approval",
  },
]

export function NextSteps() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-emerald-600" />
          What Happens Next?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="flex items-start space-x-4">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    step.status === "completed"
                      ? "bg-emerald-100 text-emerald-600"
                      : step.status === "current"
                        ? "bg-blue-100 text-blue-600 animate-pulse"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`text-sm font-medium ${
                        step.status === "completed" ? "text-emerald-800" : "text-gray-900"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{step.timeframe}</span>
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Expected Timeline</h3>
              <p className="text-sm text-amber-700 mt-1">
                Most applications are reviewed within 24-48 hours. You&#39;ll receive email updates at each step of the
                process.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
