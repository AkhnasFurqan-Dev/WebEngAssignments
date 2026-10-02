// STEP 1: Array of Objects Setup (Initial Data)
let candidates = [
    { id: 1, name: "Ahmed Khan", role: "Backend Developer", experience: 3, status: "Shortlisted", source: "LinkedIn" },
    { id: 2, name: "Sara Ahmed", role: "UI/UX Designer", experience: 1, status: "Under Review", source: "Company Website" },
    { id: 3, name: "Ali Raza", role: "Frontend Developer", experience: 5, status: "New", source: "Referral" },
    { id: 4, name: "Fatima Noor", role: "Data Analyst", experience: 0, status: "Interview", source: "Job Portal" },
    { id: 5, name: "Usman Tariq", role: "Backend Developer", experience: 7, status: "Rejected", source: "LinkedIn" },
    { id: 6, name: "Ayesha Malik", role: "Frontend Developer", experience: 2, status: "Shortlisted", source: "Company Website" },
    { id: 7, name: "Zainab Abbas", role: "UI/UX Designer", experience: 6, status: "New", source: "Referral" },
    { id: 8, name: "Bilal Saeed", role: "Data Analyst", experience: 4, status: "Under Review", source: "Job Portal" }
];

// Core Render Function
function renderCandidates(dataToRender) {
    const grid = document.getElementById('candidateGrid');

    // IF/ELSE CONDITION 1: Empty state check
    if (dataToRender.length === 0) {
        grid.innerHTML = `<div class="col-span-full p-8 text-center text-[#66706B] bg-white border border-dashed border-gray-300 rounded-xl">No candidates match the current pipeline filters.</div>`;
        return;
    }

    // STEP 2: Array.map() implementation to render DOM cards
    grid.innerHTML = dataToRender.map(c => `
        <div class="bg-white p-5 rounded-xl border border-[#E4E5E2] shadow-sm hover:shadow-md transition flex flex-col">
            <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-900">${c.name}</h3>
                <span class="text-[10px] uppercase tracking-wide font-bold px-2 py-1 rounded-full ${getStatusBadgeClass(c.status)}">${c.status}</span>
            </div>
            <p class="text-xs font-semibold text-[#C65D32] mb-4">${c.role}</p>

            <div class="text-xs text-[#66706B] space-y-1 mb-4 flex-grow">
                <p><span class="font-semibold text-gray-500">Exp:</span> ${c.experience} Years</p>
                <p><span class="font-semibold text-gray-500">Source:</span> ${c.source}</p>
            </div>

            <div class="pt-3 border-t border-gray-100 flex justify-between space-x-2 mt-auto">
                <button onclick="openEditModal(${c.id})" class="flex-1 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded border border-gray-200 transition">Edit</button>
                <button onclick="deleteCandidate(${c.id})" class="flex-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded border border-red-100 transition">Delete</button>
            </div>
        </div>
    `).join('');

    // Call insight functions whenever data changes
    generateProcessSummary();
    generateTalentMatrix();
}

// IF/ELSE CONDITION 2: Determine badge colors based on status
function getStatusBadgeClass(status) {
    if (status === 'New') {
        return 'bg-blue-100 text-blue-700';
    } else if (status === 'Under Review') {
        return 'bg-yellow-100 text-yellow-700';
    } else if (status === 'Shortlisted') {
        return 'bg-[#F4E3DA] text-[#963F24]';
    } else if (status === 'Interview') {
        return 'bg-[#477A5B] bg-opacity-20 text-[#477A5B]';
    } else {
        return 'bg-gray-100 text-gray-600';
    }
}

// STEP 3: Array.push() - Add New Candidate
function addCandidate(event) {
    event.preventDefault();

    const name = document.getElementById('addName').value;
    const role = document.getElementById('addRole').value;
    const exp = parseInt(document.getElementById('addExp').value);
    const source = document.getElementById('addSource').value;

    // IF/ELSE CONDITION 3: Basic Validation
    if (name.trim() === '' || isNaN(exp)) {
        document.getElementById('formError').innerText = "Please provide valid name and experience.";
        document.getElementById('formError').classList.remove('hidden');
        return;
    } else {
        document.getElementById('formError').classList.add('hidden');
    }

    const newCandidate = {
        id: Date.now(),
        name: name,
        role: role,
        experience: exp,
        status: "New", // Default for new ingestion
        source: source
    };

    // Requirement: Use push()
    candidates.push(newCandidate);

    document.getElementById('addForm').reset();
    applyFilters();
}

// STEP 4: Array.filter() - Delete Candidate
function deleteCandidate(id) {
    // Requirement: Use filter() to remove object
    candidates = candidates.filter(candidate => candidate.id !== id);
    applyFilters();
}

// STEP 5: Edit Modals & Update Logic
function openEditModal(id) {
    const candidate = candidates.find(c => c.id === id);
    if(candidate) {
        document.getElementById('editId').value = candidate.id;
        document.getElementById('editName').value = candidate.name;
        document.getElementById('editRole').value = candidate.role;
        document.getElementById('editExp').value = candidate.experience;
        document.getElementById('editStatus').value = candidate.status;

        document.getElementById('editModal').classList.remove('hidden');
    }
}

function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
}

function updateCandidate() {
    const id = parseInt(document.getElementById('editId').value);
    const name = document.getElementById('editName').value;
    const role = document.getElementById('editRole').value;
    const exp = parseInt(document.getElementById('editExp').value);
    const status = document.getElementById('editStatus').value;

    const index = candidates.findIndex(c => c.id === id);
    if (index !== -1) {
        candidates[index].name = name;
        candidates[index].role = role;
        candidates[index].experience = exp;
        candidates[index].status = status;
    }

    closeEditModal();
    applyFilters();
}

// STEP 6: Apply the 5 Search/Select Filters
function applyFilters() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const status = document.getElementById('filterStatus').value;
    const role = document.getElementById('filterRole').value;
    const exp = document.getElementById('filterExperience').value;
    const source = document.getElementById('filterSource').value;

    const filteredData = candidates.filter(c => {
        // Filter 1: Search Text
        const matchSearch = c.name.toLowerCase().includes(search) || c.role.toLowerCase().includes(search);
        // Filter 2: Status
        const matchStatus = status === 'All' || c.status === status;
        // Filter 3: Role
        const matchRole = role === 'All' || c.role === role;
        // Filter 5: Source
        const matchSource = source === 'All' || c.source === source;

        // Filter 4 & IF/ELSE CONDITION 4: Experience Range Logic
        let matchExp = true;
        if (exp !== 'All') {
            if (exp === '0-1') {
                matchExp = c.experience >= 0 && c.experience <= 1;
            } else if (exp === '2-3') {
                matchExp = c.experience >= 2 && c.experience <= 3;
            } else if (exp === '4-5') {
                matchExp = c.experience >= 4 && c.experience <= 5;
            } else if (exp === '6+') {
                matchExp = c.experience >= 6;
            }
        }

        return matchSearch && matchStatus && matchRole && matchExp && matchSource;
    });

    renderCandidates(filteredData);
}

// --- CONTROL STRUCTURE REQUIREMENTS ---

// REQUIREMENT: FOR LOOP
function renderRecruitmentSteps() {
    const steps = ["Application Received", "Resume Automated Screening", "Technical Rubric Scoring", "Panel Interview", "Final Decision"];
    const listContainer = document.getElementById('forLoopOutput');
    listContainer.innerHTML = '';

    // Genuine for loop usage
    for (let i = 0; i < steps.length; i++) {
        const li = document.createElement('li');
        li.innerHTML = `<span class="text-[#C65D32] font-bold mr-2">0${i+1}</span> ${steps[i]}`;
        listContainer.appendChild(li);
    }
}

// REQUIREMENT: WHILE LOOP
function generateProcessSummary() {
    const logContainer = document.getElementById('whileLoopOutput');
    logContainer.innerHTML = '';

    let i = 0;
    // Genuine while loop over the active candidate array
    while (i < candidates.length) {
        const c = candidates[i];
        logContainer.innerHTML += `<div>> Processing ID-${c.id}: ${c.name} [${c.status}]</div>`;
        i++;
    }
    logContainer.innerHTML += `<div class="mt-2 text-[#477A5B] font-bold">> EOF. ${candidates.length} records processed.</div>`;
}

// REQUIREMENT: LOOP + IF/ELSE CONDITION COMBINATION
function generateTalentMatrix() {
    const matrixContainer = document.getElementById('loopCondOutput');

    let entryLevel = 0;
    let midLevel = 0;
    let seniorLevel = 0;

    // Loop containing if/else logic for candidate categorization
    for (let i = 0; i < candidates.length; i++) {
        let exp = candidates[i].experience;

        // IF/ELSE CONDITION 5: Matrix Categorization
        if (exp < 2) {
            entryLevel++;
        } else if (exp < 5) {
            midLevel++;
        } else {
            seniorLevel++;
        }
    }

    matrixContainer.innerHTML = `
        <div class="flex justify-between items-center p-2 bg-white rounded border border-[#E4E5E2] shadow-sm">
            <span class="text-xs font-semibold text-gray-600">Entry (0-1 yrs)</span>
            <span class="text-sm font-extrabold text-[#C65D32]">${entryLevel} Candidates</span>
        </div>
        <div class="flex justify-between items-center p-2 bg-white rounded border border-[#E4E5E2] shadow-sm">
            <span class="text-xs font-semibold text-gray-600">Mid (2-4 yrs)</span>
            <span class="text-sm font-extrabold text-[#C65D32]">${midLevel} Candidates</span>
        </div>
        <div class="flex justify-between items-center p-2 bg-white rounded border border-[#E4E5E2] shadow-sm">
            <span class="text-xs font-semibold text-gray-600">Senior (5+ yrs)</span>
            <span class="text-sm font-extrabold text-[#C65D32]">${seniorLevel} Candidates</span>
        </div>
    `;
}

// Event Listeners Initialization
window.onload = () => {
    // Attach event listeners explicitly
    document.getElementById('addForm').addEventListener('submit', addCandidate);
    document.getElementById('searchInput').addEventListener('keyup', applyFilters);
    document.getElementById('filterStatus').addEventListener('change', applyFilters);
    document.getElementById('filterRole').addEventListener('change', applyFilters);
    document.getElementById('filterExperience').addEventListener('change', applyFilters);
    document.getElementById('filterSource').addEventListener('change', applyFilters);
    document.getElementById('btnCancelEdit').addEventListener('click', closeEditModal);
    document.getElementById('btnUpdateEdit').addEventListener('click', updateCandidate);

    // Initial renders
    renderRecruitmentSteps();
    renderCandidates(candidates);
};