import React, { useState } from 'react';
import { Filter, ChevronDown, Search } from 'lucide-react';

interface TransactionFiltersProps {
  onFilterChange: (filters: any) => void;
}

export function TransactionFilters({ onFilterChange }: TransactionFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState('all');
  const [category, setCategory] = useState('all');
  const [type, setType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = () => {
    onFilterChange({
      dateRange,
      category,
      type,
      searchQuery,
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleFilterChange();
          }}
          className="w-full bg-gray-50 rounded-xl py-3 pl-10 pr-4 text-sm"
        />
      </div>

      {/* Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center space-x-2 text-sm text-gray-600"
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        <ChevronDown className={`w-4 h-4 transform ${showFilters ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Options */}
      {showFilters && (
        <div className="bg-white rounded-xl p-4 space-y-4 shadow-lg">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                handleFilterChange();
              }}
              className="w-full bg-gray-50 rounded-lg py-2 px-3 text-sm"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                handleFilterChange();
              }}
              className="w-full bg-gray-50 rounded-lg py-2 px-3 text-sm"
            >
              <option value="all">All Categories</option>
              <option value="food">Food & Drinks</option>
              <option value="shopping">Shopping</option>
              <option value="transport">Transport</option>
              <option value="bills">Bills</option>
            </select>
          </div>

          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                handleFilterChange();
              }}
              className="w-full bg-gray-50 rounded-lg py-2 px-3 text-sm"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}