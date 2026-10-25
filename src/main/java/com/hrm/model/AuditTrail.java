package com.hrm.model;

import jakarta.persistence.*;

@Entity
@Table(name = "audit_trails")
public class AuditTrail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String performedBy;
    private String action;
    private String details;
    private String timestamp;

    public AuditTrail() {}
    public AuditTrail(String performedBy, String action, String details, String timestamp) {
        this.performedBy = performedBy;
        this.action = action;
        this.details = details;
        this.timestamp = timestamp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
