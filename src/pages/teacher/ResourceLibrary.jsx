import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  Globe2,
  GraduationCap,
  Plus,
  Search,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Video,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  RESOURCE_CATEGORIES,
  RESOURCE_REGIONS,
  RESOURCE_TYPES,
  createLearningResource,
  deleteLearningResource,
  fetchLearningResources,
  filterLearningResources,
  updateLearningResource,
} from '../../services/learningResources';
import './ResourceLibrary.css';

const emptyForm = {
  title: '',
  description: '',
  category: RESOURCE_CATEGORIES[0],
  region: 'All India',
  type: 'article',
  language: 'English',
  source: '',
  url: '',
  thumbnail: '',
  active: true,
};

const typeIcons = {
  video: Video,
  pdf: FileText,
  article: BookOpen,
  website: Globe2,
  training: GraduationCap,
};

const ResourceLibrary = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [region, setRegion] = useState('All');
  const [type, setType] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchLearningResources().then((items) => {
      if (mounted) setResources(items);
    });
    return () => { mounted = false; };
  }, []);

  const visibleResources = useMemo(
    () => filterLearningResources(resources, { query: searchQuery, category, region, type }),
    [category, region, resources, searchQuery, type]
  );

  const stats = useMemo(() => {
    const totalViews = resources.reduce((sum, resource) => sum + Number(resource.views || 0), 0);
    const byType = RESOURCE_TYPES.reduce((acc, item) => ({ ...acc, [item]: 0 }), {});
    resources.forEach((resource) => {
      byType[resource.type] = (byType[resource.type] || 0) + 1;
    });

    return [
      { label: 'Total Resources', value: resources.length, icon: BookOpen },
      { label: 'Total Views', value: totalViews, icon: Eye },
      { label: 'Videos', value: byType.video, icon: Video },
      { label: 'PDFs', value: byType.pdf, icon: FileText },
      { label: 'Articles', value: byType.article, icon: BookOpen },
      { label: 'Websites', value: byType.website, icon: Globe2 },
      { label: 'Training Resources', value: byType.training, icon: GraduationCap },
    ];
  }, [resources]);

  const recentUploads = useMemo(
    () => [...resources]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5),
    [resources]
  );

  const openCreateModal = () => {
    setEditingResource(null);
    setForm(emptyForm);
    setErrorMessage('');
    setModalOpen(true);
  };

  const openEditModal = (resource) => {
    setEditingResource(resource);
    setForm({
      title: resource.title,
      description: resource.description,
      category: resource.category,
      region: resource.region,
      type: resource.type,
      language: resource.language,
      source: resource.source,
      url: resource.url,
      thumbnail: resource.thumbnail,
      active: resource.active,
    });
    setErrorMessage('');
    setModalOpen(true);
  };

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveResource = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage('');

    try {
      const payload = {
        ...form,
        id: editingResource?.id,
        uploadedBy: editingResource?.uploadedBy || user?.email || user?.name || 'educator',
        views: editingResource?.views || 0,
      };
      const saved = editingResource
        ? await updateLearningResource(payload)
        : await createLearningResource(payload);

      setResources((current) => {
        if (editingResource) return current.map((item) => item.id === saved.id ? saved : item);
        return [saved, ...current];
      });
      setModalOpen(false);
      setEditingResource(null);
      setForm(emptyForm);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleResource = async (resource) => {
    const updated = await updateLearningResource({ ...resource, active: !resource.active });
    setResources((current) => current.map((item) => item.id === updated.id ? updated : item));
  };

  const removeResource = async (resource) => {
    await deleteLearningResource(resource.id);
    setResources((current) => current.filter((item) => item.id !== resource.id));
  };

  return (
    <div className="teacher-resource-page">
      <section className="teacher-resource-header">
        <div>
          <span><GraduationCap size={16} /> Educator Dashboard</span>
          <h1>Learning Resources</h1>
          <p>Manage official and educator-published resources used by Farmer Academy.</p>
        </div>
        <button className="teacher-upload-btn" onClick={openCreateModal}>
          <Plus size={18} /> Upload Resource
        </button>
      </section>

      <section className="teacher-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article key={stat.label} className="teacher-stat-card">
              <Icon size={20} />
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          );
        })}
      </section>

      <section className="teacher-recent-section">
        <div className="teacher-section-heading">
          <h2>Recent Uploads</h2>
        </div>
        <div className="teacher-recent-list">
          {recentUploads.map((resource) => {
            const Icon = typeIcons[resource.type] || BookOpen;
            return (
              <article key={resource.id}>
                <div className="teacher-resource-icon"><Icon size={18} /></div>
                <div>
                  <strong>{resource.title}</strong>
                  <span>{resource.type} - {resource.region} - {resource.views} views</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="teacher-resource-toolbar">
        <div className="teacher-resource-search">
          <Search size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search resources, source, category..."
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} title="Clear search">
              <X size={16} />
            </button>
          )}
        </div>
        <div className="teacher-resource-filters">
          <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">
            <option>All</option>
            {RESOURCE_CATEGORIES.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={region} onChange={(event) => setRegion(event.target.value)} aria-label="Filter by region">
            <option>All</option>
            {RESOURCE_REGIONS.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Filter by type">
            <option>All</option>
            {RESOURCE_TYPES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </section>

      <section className="teacher-resource-table-wrap">
        <table className="teacher-resource-table">
          <thead>
            <tr>
              <th>Resource</th>
              <th>Category</th>
              <th>Region</th>
              <th>Type</th>
              <th>Views</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleResources.map((resource) => (
              <tr key={resource.id}>
                <td>
                  <strong>{resource.title}</strong>
                  <span>{resource.source}</span>
                </td>
                <td>{resource.category}</td>
                <td>{resource.region}</td>
                <td>{resource.type}</td>
                <td>{resource.views}</td>
                <td><span className={resource.active ? 'status-active' : 'status-disabled'}>{resource.active ? 'Active' : 'Disabled'}</span></td>
                <td>
                  <div className="teacher-table-actions">
                    <button onClick={() => openEditModal(resource)} title="Edit"><Edit3 size={16} /></button>
                    <button onClick={() => toggleResource(resource)} title={resource.active ? 'Disable' : 'Enable'}>
                      {resource.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </button>
                    <button onClick={() => window.open(resource.url, '_blank', 'noopener')} title="Open"><ExternalLink size={16} /></button>
                    <button onClick={() => removeResource(resource)} title="Delete"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {modalOpen && (
        <div className="teacher-resource-modal-backdrop" onClick={() => setModalOpen(false)}>
          <form className="teacher-resource-modal" onSubmit={saveResource} onClick={(event) => event.stopPropagation()}>
            <div className="teacher-resource-modal-header">
              <div>
                <span>{editingResource ? 'Edit Resource' : 'Upload Resource'}</span>
                <h2>{editingResource ? editingResource.title : 'Publish Learning Resource'}</h2>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} title="Close"><X size={20} /></button>
            </div>

            {errorMessage && <div className="teacher-form-error">{errorMessage}</div>}

            <div className="teacher-resource-form-grid">
              <label>Title<input required value={form.title} onChange={(event) => setField('title', event.target.value)} /></label>
              <label>Official Source<input required value={form.source} onChange={(event) => setField('source', event.target.value)} /></label>
              <label className="full">Description<textarea required value={form.description} onChange={(event) => setField('description', event.target.value)} /></label>
              <label>Category<select value={form.category} onChange={(event) => setField('category', event.target.value)}>{RESOURCE_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label>Region<select value={form.region} onChange={(event) => setField('region', event.target.value)}>{RESOURCE_REGIONS.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label>Resource Type<select value={form.type} onChange={(event) => setField('type', event.target.value)}>{RESOURCE_TYPES.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label>Language<select value={form.language} onChange={(event) => setField('language', event.target.value)}><option>English</option><option>Hindi</option><option>English/Hindi</option></select></label>
              <label className="full">Resource URL<input required type="url" value={form.url} onChange={(event) => setField('url', event.target.value)} /></label>
              <label className="full">Thumbnail URL (optional)<input type="url" value={form.thumbnail} onChange={(event) => setField('thumbnail', event.target.value)} /></label>
            </div>

            <div className="teacher-modal-actions">
              <button type="button" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" disabled={isSaving}>{isSaving ? 'Publishing...' : 'Publish'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;
