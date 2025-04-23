import React, { useState, useEffect, useRef } from 'react';
import {
  Search, SlidersHorizontal, User, CheckCircle, X, AlertTriangle, 
  Eye, Send, Download, CreditCard, Calendar, UserPlus, Save, 
  ChevronDown, Columns, Keyboard
} from 'lucide-react';

// Sample data generator for patients
const createRandomPatient = (id) => {
  const firstNames = ['John', 'Emma', 'Michael', 'Sophia', 'William', 'Olivia', 'James', 'Ava', 'Robert', 'Mia'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const randomColor = ['#1976d2', '#388e3c', '#d32f2f', '#f57c00', '#7b1fa2'][Math.floor(Math.random() * 5)];
  
  const today = new Date();
  const randomYear = Math.floor(Math.random() * 70) + 1950;
  const randomMonth = Math.floor(Math.random() * 12);
  const randomDay = Math.floor(Math.random() * 28) + 1;
  const birthDate = new Date(randomYear, randomMonth, randomDay);
  
  const lastVisitDate = new Date(today);
  lastVisitDate.setDate(today.getDate() - Math.floor(Math.random() * 365));
  
  // Randomize next visit (some will be null to show amber highlight)
  let nextVisitDate = null;
  if (Math.random() > 0.3) {
    nextVisitDate = new Date(lastVisitDate);
    nextVisitDate.setMonth(lastVisitDate.getMonth() + Math.floor(Math.random() * 6) + 1);
  }
  
  // Generate random balance (some with $0, some with balance)
  const balance = Math.random() > 0.6 ? Math.floor(Math.random() * 1000) : 0;
  
  // Random insurance plan
  const plans = ['Delta PPO', 'Cigna', 'Blue Cross', 'Aetna', 'United'];
  const plan = plans[Math.floor(Math.random() * plans.length)];
  
  // Random tags
  const tags = [];
  if (Math.random() > 0.9) tags.push('VIP');
  if (Math.random() > 0.85) tags.push('Allergy');
  if (!nextVisitDate && Math.random() > 0.5) tags.push('Recall due');
  if (balance > 500 && Math.random() > 0.7) tags.push('FSA expiring');
  
  // Calculated age
  const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
  
  return {
    id,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    avatarColor: randomColor,
    mrn: `A${1000 + id}`,
    dob: birthDate,
    age,
    lastVisit: lastVisitDate,
    nextVisit: nextVisitDate,
    balance,
    plan,
    tags,
  };
};

// Create sample data set
const generatePatients = (count) => {
  return Array.from({ length: count }, (_, i) => createRandomPatient(i + 1));
};

// Avatar component
const Avatar = ({ initials, color }) => {
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-medium" style={{ backgroundColor: color }}>
      {initials}
    </div>
  );
};

// Custom chip component
const Chip = ({ label, color = "default", size = "medium", variant = "filled", onClick }) => {
  const getColorClasses = () => {
    if (variant === 'outlined') {
      switch (color) {
        case 'primary': return 'border border-blue-500 text-blue-500';
        case 'info': return 'border border-sky-500 text-sky-500';
        case 'warning': return 'border border-amber-500 text-amber-500';
        case 'error': return 'border border-red-500 text-red-500';
        default: return 'border border-gray-300 text-gray-700';
      }
    } else {
      switch (color) {
        case 'primary': return 'bg-blue-500 text-white';
        case 'info': return 'bg-sky-500 text-white';
        case 'warning': return 'bg-amber-500 text-white';
        case 'error': return 'bg-red-500 text-white';
        default: return 'bg-gray-200 text-gray-700';
      }
    }
  };
  
  const sizeClasses = size === 'small' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  
  return (
    <div 
      className={`rounded-full inline-flex items-center ${sizeClasses} ${getColorClasses()} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

// Format date for display
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default function PatientListView() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);
  const [shortcutsDialogOpen, setShortcutsDialogOpen] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [density, setDensity] = useState('comfortable');
  const [balanceFilter, setBalanceFilter] = useState([0, 1000]);
  const [recallDueFilter, setRecallDueFilter] = useState(false);
  const [planFilter, setPlanFilter] = useState([]);
  const [tagFilter, setTagFilter] = useState([]);
  const [ageFilter, setAgeFilter] = useState([0, 100]);
  const [scrolledDown, setScrolledDown] = useState(false);
  const [savedSegments, setSavedSegments] = useState([
    { id: 1, name: 'Recall Due', filters: { recallDue: true } },
    { id: 2, name: 'VIP Patients', filters: { tags: ['VIP'] } },
    { id: 3, name: 'High Balance', filters: { balance: [200, 1000] } }
  ]);
  const [activeSegment, setActiveSegment] = useState(null);
  const [columnVisibility, setColumnVisibility] = useState({
    name: true,
    dobAge: true,
    lastVisit: true,
    nextVisit: true,
    balance: true,
    plan: true,
    tags: true
  });
  
  // Refs for dropdown positioning
  const columnButtonRef = useRef(null);
  
  // Load sample data
  useEffect(() => {
    const timer = setTimeout(() => {
      setPatients(generatePatients(25)); // Reduced to 25 for performance
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // F toggles filter drawer (without modifiers)
      if (e.key === 'f' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setFilterDrawerOpen(prev => !prev);
        e.preventDefault();
      }
      
      // Ctrl+K focuses search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        document.getElementById('patient-search')?.focus();
        e.preventDefault();
      }
      
      // Escape closes any open modal/drawer
      if (e.key === 'Escape') {
        setFilterDrawerOpen(false);
        setColumnMenuOpen(false);
        setShortcutsDialogOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Apply segment
  const applySegment = (segment) => {
    if (!segment) {
      resetFilters();
      setActiveSegment(null);
      return;
    }
    
    const { filters } = segment;
    
    // Apply the filters from the segment
    if (filters.balance) setBalanceFilter(filters.balance);
    if (filters.recallDue !== undefined) setRecallDueFilter(filters.recallDue);
    if (filters.plans) setPlanFilter(filters.plans);
    if (filters.tags) setTagFilter(filters.tags);
    if (filters.age) setAgeFilter(filters.age);
    
    setActiveSegment(segment.id);
  };
  
  // Save current filters as a segment
  const saveCurrentFiltersAsSegment = (name) => {
    const newSegment = {
      id: Date.now(),
      name,
      filters: {
        balance: balanceFilter,
        recallDue: recallDueFilter,
        plans: planFilter,
        tags: tagFilter,
        age: ageFilter
      }
    };
    
    setSavedSegments(prev => [...prev, newSegment]);
    setActiveSegment(newSegment.id);
  };
  
  // Handle scroll to demonstrate header behavior
  const handleScroll = (e) => {
    setScrolledDown(e.target.scrollTop > 60);
  };
  
  // Filter patients based on all criteria
  const filteredPatients = patients.filter(patient => {
    // Search filter (case insensitive)
    const searchMatch = 
      searchTerm === '' || 
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.mrn.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Balance filter
    const balanceMatch = 
      patient.balance >= balanceFilter[0] && patient.balance <= balanceFilter[1];
    
    // Recall due filter
    const recallMatch = 
      !recallDueFilter || 
      (!patient.nextVisit || 
        (patient.nextVisit && new Date(patient.nextVisit) <= new Date(new Date().setDate(new Date().getDate() + 30))));
    
    // Plan filter
    const planMatch = 
      planFilter.length === 0 || 
      planFilter.includes(patient.plan);
    
    // Tag filter
    const tagMatch = 
      tagFilter.length === 0 || 
      tagFilter.some(tag => patient.tags.includes(tag));
    
    // Age filter
    const ageMatch = 
      patient.age >= ageFilter[0] && patient.age <= ageFilter[1];
    
    return searchMatch && balanceMatch && recallMatch && planMatch && tagMatch && ageMatch;
  });
  
  // Handle bulk actions
  const handleBulkSMS = () => {
    if (rowSelectionModel.length > 0) {
      const selectedPatients = patients.filter(p => rowSelectionModel.includes(p.id));
      const names = selectedPatients.map(p => p.firstName).join(', ');
      alert(`SMS draft: "Hello ${names}, we have openings this week—shall we book?"`);
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setBalanceFilter([0, 1000]);
    setRecallDueFilter(false);
    setPlanFilter([]);
    setTagFilter([]);
    setAgeFilter([0, 100]);
  };

  // Toggle row selection
  const toggleRowSelection = (id) => {
    setRowSelectionModel(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id) 
        : [...prev, id]
    );
  };

  // All plans for filter
  const allPlans = ['Delta PPO', 'Cigna', 'Blue Cross', 'Aetna', 'United'];
  const allTags = ['VIP', 'Allergy', 'Recall due', 'FSA expiring'];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Sticky Header */}
      <div className={`sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 ${scrolledDown ? 'shadow-md' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">Patients</h1>
            
            {/* Saved Segments */}
            {savedSegments.length > 0 && (
              <div className="flex items-center ml-4 space-x-2">
                {savedSegments.map(segment => (
                  <div 
                    key={segment.id}
                    onClick={() => applySegment(segment)}
                    className={`px-2 py-1 text-xs rounded-full cursor-pointer ${
                      activeSegment === segment.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {segment.name}
                  </div>
                ))}
                
                {activeSegment && (
                  <button
                    onClick={() => applySegment(null)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button 
              className={`p-2 rounded-full ${filterDrawerOpen ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
              aria-label="Toggle filters"
              title="Filter (F)"
            >
              <SlidersHorizontal size={20} />
            </button>

            <div className="relative">
              <button 
                ref={columnButtonRef}
                className={`p-2 rounded-full ${columnMenuOpen ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                onClick={() => setColumnMenuOpen(!columnMenuOpen)}
                aria-label="Column visibility"
                title="Column visibility"
              >
                <Columns size={20} />
              </button>
              
              {/* Column Visibility Menu */}
              {columnMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-200">
                      Toggle Columns
                    </div>
                    {Object.entries(columnVisibility).map(([key, value]) => (
                      <div 
                        key={key} 
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between items-center cursor-pointer"
                        onClick={() => setColumnVisibility(prev => ({ ...prev, [key]: !value }))}
                      >
                        <span>
                          {key === 'name' ? 'Name' : 
                           key === 'dobAge' ? 'DOB / Age' : 
                           key === 'lastVisit' ? 'Last Visit' : 
                           key === 'nextVisit' ? 'Next Visit' : 
                           key === 'balance' ? 'Balance' : 
                           key === 'plan' ? 'Plan' : 'Status Tags'}
                        </span>
                        <input 
                          type="checkbox" 
                          checked={value} 
                          onChange={() => {}} 
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button 
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
              onClick={() => setShortcutsDialogOpen(true)}
              title="Keyboard shortcuts"
            >
              <Keyboard size={20} />
            </button>
            
            <button 
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              aria-label="Add new patient"
            >
              <UserPlus size={18} />
              <span>New Patient</span>
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="w-full">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={20} className="text-gray-500" />
            </div>
            <input
              id="patient-search"
              type="text"
              placeholder="Search by name, ID, or phone..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                onClick={() => setSearchTerm('')}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        
        {/* Bulk Actions */}
        {rowSelectionModel.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {rowSelectionModel.length} patients selected
              </span>
              <div className="flex space-x-2">
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
                  <AlertTriangle size={16} />
                  <span>Merge</span>
                </button>
                <button 
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handleBulkSMS}
                >
                  <Send size={16} />
                  <span>Send SMS</span>
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
                  <Download size={16} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Keyboard Shortcuts Dialog */}
      {shortcutsDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
              <button onClick={() => setShortcutsDialogOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Toggle filter panel</span>
                <span className="px-2 py-1 bg-gray-100 rounded font-mono">F</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Focus search</span>
                <span className="px-2 py-1 bg-gray-100 rounded font-mono">Ctrl + K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Select row</span>
                <span className="px-2 py-1 bg-gray-100 rounded font-mono">Space</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Close popups</span>
                <span className="px-2 py-1 bg-gray-100 rounded font-mono">Esc</span>
              </div>
            </div>
            
            <div className="mt-6 text-right">
              <button 
                onClick={() => setShortcutsDialogOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Filter Drawer */}
      {filterDrawerOpen && (
        <div className="fixed inset-y-0 right-0 z-20 w-80 bg-white shadow-xl border-l border-gray-200 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Filter Patients</h2>
            <button onClick={() => setFilterDrawerOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Balance Filter */}
            <div>
              <h3 className="text-sm font-medium mb-2">Balance</h3>
              <div className="px-2">
                <input 
                  type="range" 
                  min="0" 
                  max="1000" 
                  step="10"
                  className="w-full"
                  value={balanceFilter[0]}
                  onChange={(e) => setBalanceFilter([parseInt(e.target.value), balanceFilter[1]])}
                />
                <input 
                  type="range" 
                  min="0" 
                  max="1000" 
                  step="10"
                  className="w-full"
                  value={balanceFilter[1]}
                  onChange={(e) => setBalanceFilter([balanceFilter[0], parseInt(e.target.value)])}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                ${balanceFilter[0]} to ${balanceFilter[1]}
              </div>
            </div>
            
            {/* Recall Due Filter */}
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="recall-due" 
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                checked={recallDueFilter}
                onChange={(e) => setRecallDueFilter(e.target.checked)}
              />
              <label htmlFor="recall-due" className="ml-2 text-sm">
                Due/Overdue within 30 days
              </label>
            </div>
            
            {/* Insurance Plan Filter */}
            <div>
              <h3 className="text-sm font-medium mb-2">Insurance Plan</h3>
              <div className="flex flex-wrap gap-2">
                {allPlans.map((plan) => (
                  <div 
                    key={plan}
                    className={`px-2 py-1 text-xs rounded-full cursor-pointer ${
                      planFilter.includes(plan) 
                        ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                    onClick={() => {
                      setPlanFilter(prev => 
                        prev.includes(plan) 
                          ? prev.filter(p => p !== plan) 
                          : [...prev, plan]
                      );
                    }}
                  >
                    {plan}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tags Filter */}
            <div>
              <h3 className="text-sm font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <div 
                    key={tag}
                    className={`px-2 py-1 text-xs rounded-full cursor-pointer ${
                      tagFilter.includes(tag) 
                        ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                    onClick={() => {
                      setTagFilter(prev => 
                        prev.includes(tag) 
                          ? prev.filter(t => t !== tag) 
                          : [...prev, tag]
                      );
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Age Range Filter */}
            <div>
              <h3 className="text-sm font-medium mb-2">Age Range</h3>
              <div className="px-2">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  className="w-full"
                  value={ageFilter[0]}
                  onChange={(e) => setAgeFilter([parseInt(e.target.value), ageFilter[1]])}
                />
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  className="w-full"
                  value={ageFilter[1]}
                  onChange={(e) => setAgeFilter([ageFilter[0], parseInt(e.target.value)])}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {ageFilter[0]} to {ageFilter[1]} years
              </div>
            </div>
            
            {/* Save Segment */}
            <div className="mt-6 mb-4">
              <div className="text-sm font-medium mb-2">Save Current Filters as Segment</div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  id="segment-name"
                  placeholder="Enter segment name" 
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 flex items-center"
                  onClick={() => {
                    const name = document.getElementById('segment-name').value;
                    if (name) {
                      saveCurrentFiltersAsSegment(name);
                      document.getElementById('segment-name').value = '';
                    }
                  }}
                >
                  <Save size={16} className="mr-1" />
                  Save
                </button>
              </div>
            </div>
            
            {/* Filter Actions */}
            <div className="flex gap-2 mt-6">
              <button 
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                onClick={resetFilters}
              >
                Reset
              </button>
              <button 
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                onClick={() => setFilterDrawerOpen(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content - Data Grid */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Data Grid */}
        <div className="flex-grow overflow-auto" onScroll={handleScroll}>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">Loading patients...</p>
            </div>
          ) : (
            <div className="min-w-full">
              {/* Table Header */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                <div className="flex items-center px-4 py-3 bg-gray-50">
                  <div className="w-12 flex-shrink-0">
                    <input 
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={rowSelectionModel.length === filteredPatients.length && filteredPatients.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRowSelectionModel(filteredPatients.map(p => p.id));
                        } else {
                          setRowSelectionModel([]);
                        }
                      }}
                    />
                  </div>
                  {columnVisibility.name && <div className="w-56 flex-shrink-0 font-medium text-sm">Name</div>}
                  {columnVisibility.dobAge && <div className="w-32 flex-shrink-0 font-medium text-sm">DOB / Age</div>}
                  {columnVisibility.lastVisit && <div className="w-32 flex-shrink-0 font-medium text-sm">Last Visit</div>}
                  {columnVisibility.nextVisit && <div className="w-32 flex-shrink-0 font-medium text-sm">Next Visit</div>}
                  {columnVisibility.balance && <div className="w-28 flex-shrink-0 font-medium text-sm">Balance</div>}
                  {columnVisibility.plan && <div className="w-36 flex-shrink-0 font-medium text-sm">Plan</div>}
                  {columnVisibility.tags && <div className="w-40 flex-shrink-0 font-medium text-sm">Status Tags</div>}
                </div>
              </div>
              
              {/* Table Body */}
              <div>
                {filteredPatients.map(patient => (
                  <div 
                    key={patient.id} 
                    className={`flex items-center px-4 border-b border-gray-200 hover:bg-gray-50 ${
                      patient.tags.includes('VIP') ? 'bg-blue-50' : ''
                    } ${
                      density === 'compact' ? 'py-1' : 
                      density === 'spacious' ? 'py-4' : 'py-2'
                    }`}
                  >
                    <div className="w-12 flex-shrink-0">
                      <input 
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={rowSelectionModel.includes(patient.id)}
                        onChange={() => toggleRowSelection(patient.id)}
                      />
                    </div>
                    
                    {/* Name */}
                    {columnVisibility.name && (
                      <div className="w-56 flex-shrink-0">
                        <div className="flex items-center space-x-3">
                          <Avatar 
                            initials={`${patient.firstName?.[0]}${patient.lastName?.[0]}`} 
                            color={patient.avatarColor}
                          />
                          <div>
                            <div className="font-medium">{patient.fullName}</div>
                            <div className="text-xs text-gray-500">MRN: {patient.mrn}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* DOB / Age */}
                    {columnVisibility.dobAge && (
                      <div className="w-32 flex-shrink-0">
                        <div>{formatDate(patient.dob)}</div>
                        <div className="text-xs text-gray-500">{patient.age} years</div>
                      </div>
                    )}
                    
                    {/* Last Visit */}
                    {columnVisibility.lastVisit && (
                      <div className="w-32 flex-shrink-0">
                        {formatDate(patient.lastVisit)}
                      </div>
                    )}
                    
                    {/* Next Visit */}
                    {columnVisibility.nextVisit && (
                      <div 
                        className={`w-32 flex-shrink-0 ${
                          !patient.nextVisit ? 'bg-amber-100 hover:bg-amber-200 cursor-pointer rounded p-1 flex items-center justify-between' : ''
                        }`}
                        onClick={() => {
                          if (!patient.nextVisit) {
                            alert(`Schedule recall for ${patient.fullName}`);
                          }
                        }}
                      >
                        {patient.nextVisit ? (
                          formatDate(patient.nextVisit)
                        ) : (
                          <>
                            <span className="text-amber-800 text-xs font-medium">Schedule Now</span>
                            <Calendar size={14} className="text-amber-800" />
                          </>
                        )}
                      </div>
                    )}
                    
                    {/* Balance */}
                    {columnVisibility.balance && (
                      <div 
                        className={`w-28 flex-shrink-0 ${patient.balance > 0 ? 'text-red-600 font-medium' : ''}`}
                        title={patient.balance > 0 ? `Collect ${patient.balance}? Add to AR queue.` : ''}
                      >
                        ${patient.balance.toFixed(2)}
                      </div>
                    )}
                    
                    {/* Plan */}
                    {columnVisibility.plan && (
                      <div 
                        className="w-36 flex-shrink-0"
                        title="$1,250 remaining benefits"
                      >
                        {patient.plan}
                      </div>
                    )}
                    
                    {/* Status Tags */}
                    {columnVisibility.tags && (
                      <div className="w-40 flex-shrink-0">
                        <div className="flex flex-wrap gap-1">
                          {patient.tags.map((tag, idx) => {
                            let chipProps = {};
                            
                            if (tag === 'VIP') {
                              chipProps = { color: 'primary', size: 'small' };
                            } else if (tag === 'Allergy') {
                              chipProps = { color: 'error', size: 'small' };
                            } else if (tag === 'Recall due') {
                              chipProps = { color: 'warning', size: 'small', variant: 'outlined' };
                            } else if (tag === 'FSA expiring') {
                              chipProps = { color: 'info', size: 'small', variant: 'outlined' };
                            }
                            
                            return (
                              <Chip key={idx} label={tag} {...chipProps} />
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Social Norm Footer */}
        <div className="py-2 px-6 border-t border-gray-200 bg-amber-50 text-center">
          <span className="text-xs text-gray-600">
            {patients.length} patients • avg recall overdue 14 days
          </span>
        </div>

        {/* Contextual Help - Triggered when user scrolls to bottom */}
        {scrolledDown && (
          <div className="fixed bottom-16 right-6 bg-white rounded-lg shadow-lg p-4 max-w-xs animate-fade-in border border-blue-200">
            <div className="flex items-start mb-2">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <CheckCircle size={20} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Quick Tip</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Empty "Next Visit" cells are highlighted in amber. Click them to quickly schedule a recall appointment.
                </p>
              </div>
            </div>
            <button className="text-xs text-blue-600 hover:text-blue-800">Got it</button>
          </div>
        )}
      </div>
    </div>
  );
}