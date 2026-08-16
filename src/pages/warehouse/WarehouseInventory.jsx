import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Boxes, Search, Filter, Edit3, ArrowUpRight, CheckCircle2, 
  MapPin, X, Save, ArrowRight
} from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';

export default function WarehouseInventory() {
  const { batches, assignStorageLocation } = useGlobalState();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [editingBatch, setEditingBatch] = useState(null);

  // Storage Location edit form state
  const [editZone, setEditZone] = useState('A');
  const [editRack, setEditRack] = useState('R-12');
  const [editSection, setEditSection] = useState('04');
  const [editPosition, setEditPosition] = useState('B');

  // Filter batches stored in or assigned to warehouse
  const storedBatches = batches.filter(b => {
    const isWh = b.currentStage === 'WAREHOUSE' || b.storageLocation;
    const matchesSearch = !searchQuery || 
      (b.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.farmerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.woolType || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || b.currentStatus?.toLowerCase().includes(statusFilter.toLowerCase());
    const matchesGrade = gradeFilter === 'ALL' || b.qualityGrade === gradeFilter;

    return isWh && matchesSearch && matchesStatus && matchesGrade;
  });

  const handleOpenEditSlot = (b) => {
    setEditingBatch(b);
    if (b.storageLocation) {
      setEditZone(b.storageLocation.zone || 'A');
      setEditRack(b.storageLocation.rack || 'R-12');
      setEditSection(b.storageLocation.section || '04');
      setEditPosition(b.storageLocation.position || 'B');
    } else {
      setEditZone('A');
      setEditRack('R-01');
      setEditSection('01');
      setEditPosition('A');
    }
  };

  const handleSaveSlot = (e) => {
    e.preventDefault();
    if (!editingBatch) return;

    assignStorageLocation(editingBatch.id || editingBatch.batchId, {
      zone: editZone,
      rack: editRack,
      section: editSection,
      position: editPosition
    });

    setEditingBatch(null);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0B120D', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Boxes size={28} /> Warehouse Inventory & Storage Slots
          </h1>
          <p style={{ color: '#666', fontSize: '15px', margin: 0 }}>
            Live physical slotting, rack allocations, and inventory management.
          </p>
        </div>
        <Link
          to="/warehouse/releases"
          style={{
            textDecoration: 'none',
            background: '#0B120D',
            color: '#DDFF86',
            padding: '12px 20px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ArrowUpRight size={16} /> Batch Release Portal
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        padding: '18px 20px',
        border: '1px solid rgba(11, 18, 13, 0.10)',
        marginBottom: '24px',
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="Search by Batch ID, Farmer, Wool Type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 36px',
              border: '1px solid rgba(11, 18, 13, 0.15)',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              outline: 'none'
            }}
          />
        </div>

        {/* Grade Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#666', textTransform: 'uppercase' }}>Grade:</span>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(11, 18, 13, 0.15)', fontSize: '13px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            <option value="ALL">All Grades</option>
            <option value="A+">Grade A+</option>
            <option value="A">Grade A</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#666', textTransform: 'uppercase' }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(11, 18, 13, 0.15)', fontSize: '13px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            <option value="ALL">All Status</option>
            <option value="Stored">Stored in Zone</option>
            <option value="Checked-In">Checked-In</option>
            <option value="Released">Released</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid rgba(11, 18, 13, 0.10)',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <table className="stacked-table-mobile" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#F8F8F3', borderBottom: '1px solid rgba(11, 18, 13, 0.10)' }}>
              <th style={{ padding: '16px 20px', fontWeight: '800', color: '#0B120D' }}>Batch ID</th>
              <th style={{ padding: '16px 20px', fontWeight: '800', color: '#0B120D' }}>Farmer / Origin</th>
              <th style={{ padding: '16px 20px', fontWeight: '800', color: '#0B120D' }}>Quantity</th>
              <th style={{ padding: '16px 20px', fontWeight: '800', color: '#0B120D' }}>Grade</th>
              <th style={{ padding: '16px 20px', fontWeight: '800', color: '#0B120D' }}>Storage Location Slot</th>
              <th style={{ padding: '16px 20px', fontWeight: '800', color: '#0B120D' }}>Check-In Date</th>
              <th style={{ padding: '16px 20px', fontWeight: '800', color: '#0B120D' }}>Status</th>
              <th style={{ padding: '16px 20px', fontWeight: '800', color: '#0B120D', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {storedBatches.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                  No stored batches found matching current filters.
                </td>
              </tr>
            ) : (
              storedBatches.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid rgba(11, 18, 13, 0.06)' }}>
                  {/* Batch ID */}
                  <td data-label="Batch ID" style={{ padding: '16px 20px', fontWeight: '800', color: '#0B120D' }}>
                    <Link to={`/farmer/track?id=${b.id}`} style={{ color: '#0B120D', textDecoration: 'none' }}>
                      {b.id}
                    </Link>
                  </td>

                  {/* Farmer */}
                  <td data-label="Farmer / Origin" style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: '700', color: '#0B120D' }}>{b.farmerName}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{b.origin}</div>
                  </td>

                  {/* Quantity */}
                  <td data-label="Quantity" style={{ padding: '16px 20px', fontWeight: '700' }}>
                    {b.quantity} KG
                    <div style={{ fontSize: '11px', color: '#777', fontWeight: 'normal' }}>{b.woolType}</div>
                  </td>

                  {/* Grade */}
                  <td data-label="Grade" style={{ padding: '16px 20px' }}>
                    <span style={{
                      background: '#EDEDCE',
                      color: '#0B120D',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontWeight: '800',
                      fontSize: '12px'
                    }}>
                      Grade {b.qualityGrade || 'A'}
                    </span>
                  </td>

                  {/* Storage Location */}
                  <td data-label="Storage Location" style={{ padding: '16px 20px' }}>
                    {b.storageLocation ? (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#F8F8F3',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid rgba(11, 18, 13, 0.12)',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#0B120D'
                      }}>
                        <span>Zone: {b.storageLocation.zone}</span>
                        <span>·</span>
                        <span>{b.storageLocation.rack}</span>
                        <span>·</span>
                        <span>Sec: {b.storageLocation.section}</span>
                        <span>·</span>
                        <span>Pos: {b.storageLocation.position}</span>
                      </div>
                    ) : (
                      <span style={{ color: '#DC2626', fontSize: '12px', fontWeight: '700' }}>
                        Slot Not Assigned
                      </span>
                    )}
                  </td>

                  {/* Check-In Date */}
                  <td data-label="Check-In Date" style={{ padding: '16px 20px', fontSize: '13px', color: '#555' }}>
                    {new Date(b.shearingDate || b.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>

                  {/* Status */}
                  <td data-label="Status" style={{ padding: '16px 20px' }}>
                    <span style={{
                      background: '#DCFCE7',
                      color: '#166534',
                      padding: '4px 10px',
                      borderRadius: '100px',
                      fontSize: '12px',
                      fontWeight: '800'
                    }}>
                      Stored in Bay
                    </span>
                  </td>

                  {/* Actions */}
                  <td data-label="Actions" style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleOpenEditSlot(b)}
                      style={{
                        background: '#0B120D',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Edit3 size={13} /> Re-Slot
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── 9. Storage Location Slotting Dialog ── */}
      {editingBatch && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(11, 18, 13, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }} onClick={() => setEditingBatch(null)}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '520px',
            width: '90%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #EEE', paddingBottom: '14px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0B120D' }}>
                  Assign Storage Location Slot
                </h3>
                <span style={{ fontSize: '13px', color: '#666' }}>
                  Batch: <strong>{editingBatch.id || editingBatch.batchId}</strong> ({editingBatch.quantity} KG)
                </span>
              </div>
              <button onClick={() => setEditingBatch(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSlot}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0B120D', marginBottom: '6px' }}>Zone</label>
                  <select 
                    value={editZone} 
                    onChange={(e) => setEditZone(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    <option value="A">Zone A (Climate Dehumidified)</option>
                    <option value="B">Zone B (Standard Wool Racks)</option>
                    <option value="C">Zone C (High Density Bales)</option>
                    <option value="D">Zone D (Quarantine/Inspection)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0B120D', marginBottom: '6px' }}>Rack</label>
                  <input 
                    type="text" 
                    value={editRack} 
                    onChange={(e) => setEditRack(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0B120D', marginBottom: '6px' }}>Section</label>
                  <input 
                    type="text" 
                    value={editSection} 
                    onChange={(e) => setEditSection(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0B120D', marginBottom: '6px' }}>Position</label>
                  <select 
                    value={editPosition} 
                    onChange={(e) => setEditPosition(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    <option value="A">Position A (Top Shelf)</option>
                    <option value="B">Position B (Mid Level)</option>
                    <option value="C">Position C (Lower Tier)</option>
                    <option value="Floor">Floor Pallet</option>
                  </select>
                </div>
              </div>

              <div style={{ background: '#EDEDCE', padding: '14px', borderRadius: '10px', marginBottom: '24px', fontSize: '13px', color: '#0B120D' }}>
                <strong>Preview Physical Mapping:</strong>
                <div style={{ fontWeight: '800', marginTop: '4px' }}>
                  Zone {editZone} · Rack {editRack} · Section {editSection} · Position {editPosition}
                </div>
                <small style={{ color: '#555' }}>
                  This location will update immediately on the farmer's batch overview and public tracking passport.
                </small>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: '#0B120D',
                    color: '#DDFF86',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Save size={16} /> Save Slot Assignment
                </button>
                <button
                  type="button"
                  onClick={() => setEditingBatch(null)}
                  style={{
                    padding: '12px 20px',
                    background: '#F8F8F3',
                    border: '1px solid #CCC',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
