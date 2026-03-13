import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { submitIncident } from "../api";

export function NewIncidentPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = React.useState({
    labId: "",
    reportedBy: "student" as "student" | "assistant" | "technician",
    incidentType: "network_unstable",
    severityHint: 3,
    description: "",
  });

  const mutation = useMutation({
    mutationFn: submitIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      setTimeout(() => navigate({ to: "/incidents" }), 1500);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "severityHint" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <main className="page">
      <div className="page-header">
        <h1>Report New Incident</h1>
        <p className="page-subtitle">
          Submit an incident to the RabbitMQ queue for async processing
        </p>
      </div>

      {mutation.isSuccess && (
        <div className="success-banner">
          ✅ Incident published to RabbitMQ! Redirecting...
        </div>
      )}

      <div className="form-card">
        <form onSubmit={handleSubmit} className="incident-form">
          <div className="form-row">
            <label htmlFor="labId">Lab ID</label>
            <input
              id="labId"
              name="labId"
              type="text"
              placeholder="e.g. LAB-NET-02"
              value={form.labId}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={32}
            />
          </div>

          <div className="form-row">
            <label htmlFor="reportedBy">Reported By</label>
            <select id="reportedBy" name="reportedBy" value={form.reportedBy} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="assistant">Assistant</option>
              <option value="technician">Technician</option>
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="incidentType">Incident Type</label>
            <select id="incidentType" name="incidentType" value={form.incidentType} onChange={handleChange}>
              <option value="device_overheat">Device Overheat</option>
              <option value="network_unstable">Network Unstable</option>
              <option value="water_leak">Water Leak</option>
              <option value="projector_failure">Projector Failure</option>
              <option value="minor_noise">Minor Noise</option>
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="severityHint">Severity (1–5): <strong>{form.severityHint}</strong></label>
            <input
              id="severityHint"
              name="severityHint"
              type="range"
              min={1}
              max={5}
              value={form.severityHint}
              onChange={handleChange}
              className="range-input"
            />
            <div className="range-labels">
              <span>Low</span><span>High</span>
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the incident in detail (min 10 chars)..."
              value={form.description}
              onChange={handleChange}
              required
              minLength={10}
              maxLength={280}
              rows={4}
            />
            <div className="char-count">{form.description.length}/280</div>
          </div>

          {mutation.isError && (
            <div className="error-banner">
              {mutation.error instanceof Error ? mutation.error.message : "Error submitting form"}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={mutation.isPending}>
            {mutation.isPending ? "Publishing..." : "🚀 Publish to RabbitMQ"}
          </button>
        </form>
      </div>
    </main>
  );
}
