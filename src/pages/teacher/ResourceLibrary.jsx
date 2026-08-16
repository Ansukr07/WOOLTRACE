import React, { useMemo, useState } from 'react';
import { BookOpen, ExternalLink, Filter, GraduationCap, Search, X } from 'lucide-react';
import {
  RESOURCE_CATEGORIES,
  RESOURCE_REGIONS,
  RESOURCE_TYPES,
  filterLearningResources,
  learningResources,
} from '../../services/learningResources';
import './ResourceLibrary.css';

const ResourceLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [region, setRegion] = useState('All');
  const [type, setType] = useState('All');
  const [selectedResource, setSelectedResource] = useState(null);

  const visibleResources = useMemo(
    () => filterLearningResources(learningResources, { query: searchQuery, category, region, type }),
    [category, region, searchQuery, type]
  );

  return (
    <div className="teacher-resource-page">
      <section className="teacher-resource-header">
        <div>
          <span><GraduationCap size={16} /> Educator Library</span>
          <h1>Learning Resources</h1>
          <p>Official sheep, wool, and scheme resources for WoolTrace learning programs.</p>
        </div>
        <strong>{visibleResources.length} resources</strong>
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
          <Filter size={17} />
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

      <section className="teacher-resource-grid">
        {visibleResources.map((resource) => (
          <article key={resource.id} className="teacher-resource-card">
            <div className="teacher-resource-icon"><BookOpen size={20} /></div>
            <div>
              <div className="teacher-resource-meta">
                <span>{resource.type}</span>
                <span>{resource.region}</span>
              </div>
              <h2>{resource.title}</h2>
              <p>{resource.description}</p>
              <strong>{resource.sourceOrganization}</strong>
            </div>
            <div className="teacher-resource-actions">
              <button onClick={() => setSelectedResource(resource)}>Details</button>
              <button onClick={() => window.open(resource.sourceUrl, '_blank', 'noopener')} title="Open original resource">
                <ExternalLink size={16} />
              </button>
            </div>
          </article>
        ))}
      </section>

      {selectedResource && (
        <div className="teacher-resource-modal-backdrop" onClick={() => setSelectedResource(null)}>
          <div className="teacher-resource-modal" onClick={(event) => event.stopPropagation()}>
            <div className="teacher-resource-modal-header">
              <div>
                <span>{selectedResource.category}</span>
                <h2>{selectedResource.title}</h2>
              </div>
              <button onClick={() => setSelectedResource(null)} title="Close"><X size={20} /></button>
            </div>
            <dl>
              <div><dt>Description</dt><dd>{selectedResource.description}</dd></div>
              <div><dt>Type</dt><dd>{selectedResource.type}</dd></div>
              <div><dt>Region</dt><dd>{selectedResource.region}</dd></div>
              <div><dt>Language</dt><dd>{selectedResource.language}</dd></div>
              <div><dt>Source</dt><dd>{selectedResource.sourceOrganization}</dd></div>
            </dl>
            <button
              className="teacher-resource-open"
              onClick={() => window.open(selectedResource.sourceUrl, '_blank', 'noopener')}
            >
              Open official resource <ExternalLink size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;
