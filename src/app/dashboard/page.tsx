'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { apiService } from '@/services/api';
import { Statistics, User } from '@/types/api';

const DashboardPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [statistics, setStatistics] = useState<Statistics[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState('');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [columnFilters, setColumnFilters] = useState<{[key: string]: string}>({});

  // Mock campaigns data from HTML
  const mockCampaigns = [
    { id: '1', name: 'Summer Sale 2024', status: 'active', startDate: '2024-06-01' },
    { id: '2', name: 'Black Friday Special', status: 'paused', startDate: '2024-11-15' },
    { id: '3', name: 'New Product Launch', status: 'active', startDate: '2024-07-01' },
    { id: '4', name: 'Holiday Campaign', status: 'completed', startDate: '2024-12-01', endDate: '2024-12-31' }
  ];

  // Mock statistics data from HTML
  const mockStatistics = [
    {
      id: '1',
      campaignId: '1',
      campaignName: 'Summer Sale 2024',
      impressions: 125000,
      clicks: 3500,
      conversions: 287,
      cost: 2450.00,
      revenue: 8900.00,
      ctr: 2.8,
      cpa: 8.54,
      roas: 363.3,
      date: '2024-09-01'
    },
    {
      id: '2',
      campaignId: '2',
      campaignName: 'Black Friday Special',
      impressions: 89000,
      clicks: 2100,
      conversions: 156,
      cost: 1800.00,
      revenue: 5600.00,
      ctr: 2.4,
      cpa: 11.54,
      roas: 311.1,
      date: '2024-09-02'
    }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);



  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const [statsData, pendingData] = await Promise.all([
        apiService.getStatistics(),
        apiService.getPendingUsers().catch(() => []) // Non-admin users might not have access
      ]);
      
      setStatistics(statsData);
      setPendingUsers(pendingData);
    } catch (err) {
      console.error('Failed to load statistics data:', err);
      setError('Failed to load statistics data');
    } finally {
      setIsLoadingData(false);
    }
  };

  const calculateKPIs = () => {
    // Use mock data for demo, filter by selected campaigns
    const filteredData = selectedCampaigns.length > 0 
      ? mockStatistics.filter(stat => selectedCampaigns.includes(stat.campaignId))
      : mockStatistics;

    if (filteredData.length === 0) {
      return {
        totalImpressions: 0,
        totalClicks: 0,
        totalConversions: 0,
        totalCost: 0,
        totalRevenue: 0,
        avgCTR: 0,
        avgCPA: 0,
        totalROAS: 0
      };
    }

    const totalImpressions = filteredData.reduce((sum, stat) => sum + stat.impressions, 0);
    const totalClicks = filteredData.reduce((sum, stat) => sum + stat.clicks, 0);
    const totalConversions = filteredData.reduce((sum, stat) => sum + stat.conversions, 0);
    const totalCost = filteredData.reduce((sum, stat) => sum + stat.cost, 0);
    const totalRevenue = filteredData.reduce((sum, stat) => sum + stat.revenue, 0);
    
    const avgCTR = filteredData.length > 0 ? 
      filteredData.reduce((sum, stat) => sum + stat.ctr, 0) / filteredData.length : 0;
    const avgCPA = totalConversions > 0 ? totalCost / totalConversions : 0;
    const totalROAS = totalCost > 0 ? (totalRevenue / totalCost) * 100 : 0;

    return {
      totalImpressions,
      totalClicks,
      totalConversions,
      totalCost,
      totalRevenue,
      avgCTR,
      avgCPA,
      totalROAS
    };
  };

  const handleCampaignClick = (campaignId: string) => {
    setSelectedCampaigns(prev => {
      if (prev.includes(campaignId)) {
        return prev.filter(id => id !== campaignId);
      } else {
        return [...prev, campaignId];
      }
    });
  };

  const handleFilterChange = (column: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const getFilteredStatistics = () => {
    let filtered = statistics;
    
    // Apply column filters
    Object.keys(columnFilters).forEach(column => {
      const filterValue = columnFilters[column];
      if (filterValue) {
        filtered = filtered.filter(stat => {
          const cellValue = stat[column as keyof Statistics];
          return cellValue?.toString().toLowerCase().includes(filterValue.toLowerCase());
        });
      }
    });
    
    return filtered;
  };

  const clearFilter = (column: string) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[column];
      return newFilters;
    });
  };



  const kpis = calculateKPIs();

  const kpiCards = [
    { label: 'Total Impressions', value: kpis.totalImpressions.toLocaleString(), icon: 'fas fa-eye' },
    { label: 'Total Clicks', value: kpis.totalClicks.toLocaleString(), icon: 'fas fa-mouse-pointer' },
    { label: 'Total Conversions', value: kpis.totalConversions.toLocaleString(), icon: 'fas fa-check-circle' },
    { label: 'Total Cost', value: `$${kpis.totalCost.toLocaleString()}`, icon: 'fas fa-dollar-sign' },
    { label: 'Total Revenue', value: `$${kpis.totalRevenue.toLocaleString()}`, icon: 'fas fa-chart-line' },
    { label: 'Avg CTR', value: `${kpis.avgCTR.toFixed(1)}%`, icon: 'fas fa-percentage' },
    { label: 'Avg CPA', value: `$${kpis.avgCPA.toFixed(2)}`, icon: 'fas fa-coins' },
    { label: 'Total ROAS', value: `${kpis.totalROAS.toFixed(1)}%`, icon: 'fas fa-arrow-trend-up' }
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout pendingCount={pendingUsers.length}>
      {error && (
        <div className="alert alert-error show">
          {error}
        </div>
      )}

      {/* Feedback Section */}
      <div className="feedback-section">
        <div style={{ color: '#9ca3af', fontSize: '16px', fontStyle: 'italic' }}>
          <i className="fas fa-chart-line" style={{ fontSize: '24px', marginBottom: '10px', display: 'block' }}></i>
          AI insights and feedback will appear here
        </div>
      </div>

      {/* Campaign Filter */}
      <div className="campaign-selector">
        <h2 className="section-title">Campaign Filter</h2>
        <div className="campaign-chips">
          {mockCampaigns.map(campaign => (
            <div 
              key={campaign.id}
              className={`campaign-chip ${selectedCampaigns.includes(campaign.id) ? 'selected' : ''}`}
              onClick={() => handleCampaignClick(campaign.id)}
            >
              {campaign.name}
            </div>
          ))}
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="kpis-section">
        <h2 className="section-title">Key Performance Indicators</h2>
        {isLoadingData ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
            Loading statistics...
          </div>
        ) : (
          <div className="kpis-grid">
            {kpiCards.map((kpi, index) => (
              <div key={index} className="kpi-card">
                <div className="kpi-header"></div>
                <div className="kpi-content">
                  <div className="kpi-top">
                    <div className="kpi-label">{kpi.label}</div>
                    <i className={`${kpi.icon} kpi-icon`}></i>
                  </div>
                  <div className="kpi-value">{kpi.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coming Soon Charts Section */}
      <div className="coming-soon">
        <i className="fas fa-chart-line"></i>
        <h3>Interactive Charts Coming Soon</h3>
        <p>Advanced visualizations and analytics will be available here</p>
      </div>

      {/* Data Table */}
      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 className="section-title" style={{ margin: 0 }}>Statistics Data Table</h2>
          <div style={{ color: '#9ca3af', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <i className="fas fa-arrows-alt-h"></i>
            Scroll horizontally to see all columns
          </div>
        </div>
        {(() => {
          if (isLoadingData) {
            return (
              <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                Loading statistics data...
              </div>
            );
          }
          
          const filteredStatistics = getFilteredStatistics();
          
          if (filteredStatistics.length > 0) {
            return (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          Date
                          <div className="filter-dropdown">
                            <button className="filter-btn" title="Filter by Date">
                              <i className="fas fa-filter"></i>
                            </button>
                            <div className="filter-content">
                              <input
                                type="text"
                                placeholder="Filter by date..."
                                value={columnFilters.date || ''}
                                onChange={(e) => handleFilterChange('date', e.target.value)}
                              />
                              {columnFilters.date && (
                                <button onClick={() => clearFilter('date')} className="clear-filter">
                                  <i className="fas fa-times"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </th>
                      <th>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          Creative
                          <div className="filter-dropdown">
                            <button className="filter-btn" title="Filter by Creative">
                              <i className="fas fa-filter"></i>
                            </button>
                            <div className="filter-content">
                              <input
                                type="text"
                                placeholder="Filter by creative..."
                                value={columnFilters.creative || ''}
                                onChange={(e) => handleFilterChange('creative', e.target.value)}
                              />
                              {columnFilters.creative && (
                                <button onClick={() => clearFilter('creative')} className="clear-filter">
                                  <i className="fas fa-times"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </th>
                      <th>
                        Creative Size
                        <button className="filter-btn" title="Filter by Creative Size">
                          <i className="fas fa-filter"></i>
                        </button>
                      </th>
                      <th>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          Country
                          <div className="filter-dropdown">
                            <button className="filter-btn" title="Filter by Country">
                              <i className="fas fa-filter"></i>
                            </button>
                            <div className="filter-content">
                              <input
                                type="text"
                                placeholder="Filter by country..."
                                value={columnFilters.country || ''}
                                onChange={(e) => handleFilterChange('country', e.target.value)}
                              />
                              {columnFilters.country && (
                                <button onClick={() => clearFilter('country')} className="clear-filter">
                                  <i className="fas fa-times"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </th>
                      <th>
                        Line Item 1
                        <button className="filter-btn" title="Filter by Line Item 1">
                          <i className="fas fa-filter"></i>
                        </button>
                      </th>
                      <th>
                        Line Item 2
                        <button className="filter-btn" title="Filter by Line Item 2">
                          <i className="fas fa-filter"></i>
                        </button>
                      </th>
                      <th>
                        Line Item 3
                        <button className="filter-btn" title="Filter by Line Item 3">
                          <i className="fas fa-filter"></i>
                        </button>
                      </th>
                      <th>
                        Line Item 4
                        <button className="filter-btn" title="Filter by Line Item 4">
                          <i className="fas fa-filter"></i>
                        </button>
                      </th>
                      <th>
                        Line Item 5
                        <button className="filter-btn" title="Filter by Line Item 5">
                          <i className="fas fa-filter"></i>
                        </button>
                      </th>
                      <th>
                        Line Item 6
                        <button className="filter-btn" title="Filter by Line Item 6">
                          <i className="fas fa-filter"></i>
                        </button>
                      </th>
                      <th>
                        Line Item 7
                        <button className="filter-btn" title="Filter by Line Item 7">
                          <i className="fas fa-filter"></i>
                        </button>
                      </th>
                      <th>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          Impressions
                          <div className="filter-dropdown">
                            <button className="filter-btn" title="Filter by Impressions">
                              <i className="fas fa-filter"></i>
                            </button>
                            <div className="filter-content">
                              <input
                                type="text"
                                placeholder="Filter by impressions..."
                                value={columnFilters.impressions || ''}
                                onChange={(e) => handleFilterChange('impressions', e.target.value)}
                              />
                              {columnFilters.impressions && (
                                <button onClick={() => clearFilter('impressions')} className="clear-filter">
                                  <i className="fas fa-times"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </th>
                      <th>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          Clicks
                          <div className="filter-dropdown">
                            <button className="filter-btn" title="Filter by Clicks">
                              <i className="fas fa-filter"></i>
                            </button>
                            <div className="filter-content">
                              <input
                                type="text"
                                placeholder="Filter by clicks..."
                                value={columnFilters.clicks || ''}
                                onChange={(e) => handleFilterChange('clicks', e.target.value)}
                              />
                              {columnFilters.clicks && (
                                <button onClick={() => clearFilter('clicks')} className="clear-filter">
                                  <i className="fas fa-times"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </th>
                      <th>
                        Click Rate (CTR)
                        <button className="filter-btn" title="Filter by Click Rate">
                          <i className="fas fa-filter"></i>
                        </button>
                      </th>
                      <th>
                        First-Quartile Views (Video)
                        <button className="filter-btn" title="Filter by First-Quartile Views">
                          <i className="fas fa-filter"></i>
                        </button>
                      </th>
                      <th>
                        Midpoint Views (Video)
                        <button className="filter-btn" title="Filter by Midpoint Views">
                          <i className="fas fa-filter"></i>
                        </button>
                      </th>
                      <th>
                        Third-Quartile Views (Video)
                        <button className="filter-btn" title="Filter by Third-Quartile Views">
                          <i className="fas fa-filter"></i>
                        </button>
                      </th>
                      <th>
                        Complete Views (Video)
                        <button className="filter-btn" title="Filter by Complete Views">
                          <i className="fas fa-filter"></i>
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStatistics.map((stat) => (
                      <tr key={stat.id}>
                        <td>{stat.date}</td>
                        <td title={stat.creative}>{stat.creative.length > 50 ? stat.creative.substring(0, 50) + '...' : stat.creative}</td>
                        <td>{stat.creativeSize}</td>
                        <td>{stat.country}</td>
                        <td>{stat.lineItem1}</td>
                        <td>{stat.lineItem2}</td>
                        <td>{stat.lineItem3}</td>
                        <td>{stat.lineItem4}</td>
                        <td>{stat.lineItem5}</td>
                        <td>{stat.lineItem6}</td>
                        <td>{stat.lineItem7}</td>
                        <td>{parseInt(stat.impressions).toLocaleString()}</td>
                        <td>{parseInt(stat.clicks).toLocaleString()}</td>
                        <td>{(parseFloat(stat.clickRate) * 100).toFixed(2)}%</td>
                        <td>{parseInt(stat.firstQuartileViews).toLocaleString()}</td>
                        <td>{parseInt(stat.midpointViews).toLocaleString()}</td>
                        <td>{parseInt(stat.thirdQuartileViews).toLocaleString()}</td>
                        <td>{parseInt(stat.completeViews).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          } else {
            return (
              <div className="empty-state">
                <i className="fas fa-chart-bar"></i>
                <h3>No Statistics Data</h3>
                <p>No statistics data available from API</p>
              </div>
            );
          }
        })()}
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DashboardPage;
