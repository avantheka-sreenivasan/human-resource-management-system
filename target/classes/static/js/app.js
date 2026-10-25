
let currentUser = { name: "Carol Williams", role: "HR_ADMIN" };

document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/init').then(() => {
        loadData();
    });
});

function switchRole() {
    const role = document.getElementById('roleSelect').value;
    const names = {
        'HR_ADMIN': 'Carol Williams (HR Admin)',
        'MANAGER': 'Bob Johnson (Manager)',
        'RECRUITER': 'David Lee (Recruiter)',
        'EMPLOYEE': 'Alice Smith (Employee)'
    };
    currentUser = { name: names[role].split(' ')[0], role: role };
    document.getElementById('currentUserLabel').innerText = names[role];
    
    const hrElems = document.querySelectorAll('.hr-only');
    hrElems.forEach(el => el.style.display = (role === 'HR_ADMIN' || role === 'MANAGER' || role === 'RECRUITER') ? 'block' : 'none');

    loadData();
}

function showTab(tabId) {
    document.querySelectorAll('.tab-view').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
}

function handleSearch(query) {
    if (!query || query.length === 0) {
        document.getElementById('searchResults').innerHTML = '';
        return;
    }
    fetch(`/api/autocomplete?query=${query}`).then(res => res.json()).then(users => {
        document.getElementById('searchResults').innerHTML = users.map(u => `
            <div class="search-item">🔍 <strong>${u.name}</strong> (${u.role}) - ${u.department} [ID: ${u.customUniqueId}]</div>
        `).join('');
    });
}

function triggerCrawler() {
    fetch('/api/crawler/crawl', { method: 'POST' }).then(res => res.json()).then(data => {
        document.getElementById('crawlerStatus').innerText = data.message;
        loadJobs();
    });
}

function loadJobs() {
    fetch('/api/jobs').then(res => res.json()).then(jobs => {
        document.getElementById('jobTable').innerHTML = jobs.map(j => `
            <tr>
                <td>${j.title}</td>
                <td>${j.company}</td>
                <td>${j.location}</td>
                <td><span class="badge">${j.sourcePortal}</span></td>
                <td><a href="#" style="color:#38bdf8;">${j.shortUrl}</a></td>
            </tr>
        `).join('');
    });
}

function loadData() {
    fetch('/api/users').then(res => res.json()).then(users => {
        const tbody = document.getElementById('rosterTable');
        tbody.innerHTML = users.map(u => `
            <tr>
                <td><code>${u.customUniqueId}</code></td>
                <td>${u.name}</td>
                <td><span class="badge">${u.role}</span></td>
                <td>${u.department}</td>
                <td><span class="trend positive">${u.shardNode}</span></td>
                <td>$${u.salary.toLocaleString()}</td>
            </tr>
        `).join('');
    });

    fetch('/api/leaves').then(res => res.json()).then(leaves => {
        const tbody = document.getElementById('leaveTable');
        tbody.innerHTML = leaves.map(l => `
            <tr>
                <td>#${l.id}</td>
                <td>${l.employeeName}</td>
                <td>${l.leaveType}</td>
                <td>${l.startDate} to ${l.endDate}</td>
                <td><strong>${l.status}</strong></td>
                <td>
                    ${l.status === 'PENDING' && (currentUser.role === 'HR_ADMIN' || currentUser.role === 'MANAGER') ? `
                        <button class="btn-sm btn-success" onclick="actLeave(${l.id}, 'APPROVED')">Approve</button>
                        <button class="btn-sm btn-danger" onclick="actLeave(${l.id}, 'REJECTED')">Reject</button>
                    ` : '-'}
                </td>
            </tr>
        `).join('');
    });

    fetch('/api/audit').then(res => res.json()).then(logs => {
        document.getElementById('auditTable').innerHTML = logs.map(a => `
            <tr>
                <td>${a.timestamp}</td>
                <td>${a.performedBy}</td>
                <td><strong>${a.action}</strong></td>
                <td>${a.details}</td>
            </tr>
        `).join('');
    });

    fetch('/api/notifications').then(res => res.json()).then(notifs => {
        document.getElementById('notifTable').innerHTML = notifs.map(n => `
            <tr>
                <td>${n.recipient}</td>
                <td>${n.type}</td>
                <td>${n.message}</td>
                <td><span class="trend ${n.status==='SENT'?'positive':'warning'}">${n.status}</span></td>
            </tr>
        `).join('');
    });

    fetch('/api/scalability').then(res => res.json()).then(sc => {
        document.getElementById('kvHitRate').innerText = sc.cacheHitRate;
        document.getElementById('rlRejection').innerText = sc.rateLimiterRejectionRate;
        document.getElementById('idGenRate').innerText = sc.idGenRate;

        document.getElementById('workloadTable').innerHTML = sc.workloadMetrics.map(w => `
            <tr>
                <td><strong>${w.level}</strong></td>
                <td>${w.avgResponseTime}</td>
                <td>${w.throughput}</td>
                <td><span class="trend ${w.errorRate === '0.0%' ? 'positive' : 'warning'}">${w.errorRate}</span></td>
            </tr>
        `).join('');

        document.getElementById('serverNodes').innerHTML = sc.serverStatus.map(s => `
            <div class="server-node ${s.status.includes('CRITICAL') ? 'critical' : ''}">
                <h4>${s.node}</h4>
                <p style="font-size:12px; color:#94a3b8;">${s.role}</p>
                <p class="mt-10">Status: <strong>${s.status}</strong></p>
                <p>Load: ${s.load}</p>
            </div>
        `).join('');
    });

    loadJobs();
    renderCharts();
}

function handleLeaveSubmit(e) {
    e.preventDefault();
    const payload = {
        employeeId: 1,
        employeeName: currentUser.name,
        leaveType: document.getElementById('leaveType').value,
        startDate: document.getElementById('leaveStart').value,
        endDate: document.getElementById('leaveEnd').value,
        reason: document.getElementById('leaveReason').value
    };
    fetch('/api/leaves', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    }).then(() => loadData());
}

function actLeave(id, status) {
    fetch(`/api/leaves/${id}/action?status=${status}&actor=${currentUser.name}`, { method: 'POST' })
        .then(() => loadData());
}

function updateProfile(e) {
    e.preventDefault();
    const payload = {
        name: document.getElementById('profName').value,
        department: document.getElementById('profDept').value,
        email: document.getElementById('profEmail').value,
        salary: 75000
    };
    fetch(`/api/users/1?actor=${currentUser.name}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    }).then(() => {
        alert("Profile updated successfully!");
        loadData();
    });
}

function exportPayslip(type) {
    alert(`Downloading Payslip receipt as ${type.toUpperCase()}... File generated.`);
}

function uploadDoc(e) {
    e.preventDefault();
    const file = document.getElementById('fileInput').files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadedBy', currentUser.name);

    fetch('/api/documents/upload', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
            document.getElementById('uploadStatus').innerText = data.message || "Upload completed!";
            loadData();
        });
}

function renderCharts() {
    const ctx1 = document.getElementById('deptChart');
    if (ctx1 && !window.deptChartInstance) {
        window.deptChartInstance = new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: ['Engineering', 'HR', 'Talent Acq.'],
                datasets: [{ data: [2, 1, 1], backgroundColor: ['#6366f1', '#10b981', '#f59e0b'] }]
            }
        });
    }

    const ctx2 = document.getElementById('perfChart');
    if (ctx2 && !window.perfChartInstance) {
        window.perfChartInstance = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Exceeds', 'Meets', 'Needs Improvement'],
                datasets: [{ label: '% of Staff', data: [35, 55, 10], backgroundColor: '#38bdf8' }]
            }
        });
    }
}
