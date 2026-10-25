package com.hrm.model;

import jakarta.persistence.*;

@Entity
@Table(name = "app_users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String customUniqueId;
    private String username;
    private String name;
    private String role;
    private String department;
    private double salary;
    private String email;
    private String shardNode;

    public User() {}
    public User(String customUniqueId, String username, String name, String role, String department, double salary, String email, String shardNode) {
        this.customUniqueId = customUniqueId;
        this.username = username;
        this.name = name;
        this.role = role;
        this.department = department;
        this.salary = salary;
        this.email = email;
        this.shardNode = shardNode;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCustomUniqueId() { return customUniqueId; }
    public void setCustomUniqueId(String customUniqueId) { this.customUniqueId = customUniqueId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public double getSalary() { return salary; }
    public void setSalary(double salary) { this.salary = salary; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getShardNode() { return shardNode; }
    public void setShardNode(String shardNode) { this.shardNode = shardNode; }
}
