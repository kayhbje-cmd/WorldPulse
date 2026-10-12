// src/components/FilterBar.tsx - Filtering by Status, Category, Locality, and Sort

import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Clock, 
  UtensilsCrossed, 
  MapPin, 
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import { EventCategory, FilterState, TimeFilterOption, SortOption } from '../types';
import { AMRAVATI_LOCALITIES } from '../utils/geo';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
  hasActiveFilters: boolean;
  hasLocation: boolean;
}

const CATEGORIES: { id: EventCategory | 'all'; label: string; marathi: string }[] = [
  { id: 'all', label: 'All Categories', marathi: 'सर्व' },
  { id: 'bhandara', label: 'Bhandara', marathi: 'भंडारा' },
  { id: 'mahaprasad', label: 'Mahaprasad', marathi: 'महाप्रसाद' },
  { id: 'annadan', label: 'Annadan Seva', marathi: 'अन्नदान' },
  { id: 'temple_feast', label: 'Temple Feast', marathi: 'मंदिर महाप्रसाद' },
  { id: 'community_meals', label: 'Community Meals (J1)', marathi: 'सामुदायिक जेवण' },
];

const TIME_FILTERS: { id: TimeFilterOption; label: string; countHint?: string }[] = [
  { id: 'all', label: 'All Events' },
  { id: 'today', label: 'Today' },
  { id: 'currently_serving', label: 'Currently Serving 🟢' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalFilteredCount,
  hasActiveFilters,
  hasLocation,
}) => {
  return (
    <div className="bg-white border-y border-stone-200/80 sticky top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
        {/* Top row: Time status tabs & Locality / Sort dropdowns */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Time Filter Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {TIME_FILTERS.map((tf) => {
              const isActive = filters.timeFilter === tf.id;
              return (
                <button
                  key={tf.id}
                  onClick={() => onFilterChange({ timeFilter: tf.id })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-xs shadow-orange-600/30 font-bold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900'
                  }`}
                >
                  {tf.label}
                </button>
              );
            })}
          </div>

          {/* Right side controls: Locality, Sort, and Clear */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Locality Dropdown */}
            <div className="flex items-center space-x-1.5 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-700">
              <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <select
                value={filters.locality}
                onChange={(e) => onFilterChange({ locality: e.target.value })}
                className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="">All Amravati Localities</option>
                {AMRAVATI_LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1.5 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
                className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="upcoming">Sort: Upcoming Date</option>
                <option value="nearest" disabled={!hasLocation}>
                  Sort: Nearest First {!hasLocation ? '(Requires GPS)' : ''}
                </option>
                <option value="recently_added">Sort: Recently Added</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom row: Category Chips & Result summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-stone-100">
          {/* Categories Pill Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => {
              const isSelected = filters.category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onFilterChange({ category: cat.id })}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-100 border border-amber-300 text-amber-950 font-bold'
                      : 'bg-stone-50 border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Result Count Indicator */}
          <div className="text-[11px] text-stone-500 font-medium whitespace-nowrap self-end sm:self-center">
            Found <span className="font-bold text-orange-700">{totalFilteredCount}</span>{' '}
            {totalFilteredCount === 1 ? 'event' : 'events'} in Amravati
          </div>
        </div>
      </div>
    </div>
  );
};
