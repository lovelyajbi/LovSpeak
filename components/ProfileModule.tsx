
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, ActivityLog, Badge, AppView } from '../types';
import { BADGE_DEFINITIONS, ISLAMIC_QUOTES, XP_THRESHOLDS, AVATAR_ICONS } from '../constants';
import { 
  getUserProfile, saveUserProfile, getActivityLogs, 
  exportFullSystemBackup, importFullSystemBackup, getVocab,
  getGameProgress, getGeminiApiKey, saveGeminiApiKey, clearGeminiApiKey,
  getAppLanguage, setAppLanguage
} from '../services/storage';

// Types for Analytics
type TimeFilter = 'today' | 'week' | 'month';
type MetricType = 'score' | 'accuracy' | 'duration' | 'attempts';
type ChartType = 'bar' | 'donut';

interface ModuleStat {
  module: string;
  totalScore: number;
  totalAccuracy: number;
  totalDuration: number;
  attempts: number;
  avgScore: number;
  avgAccuracy: number;
}

interface ChartDataPoint {
  label: string;
  value: number;
  colorClass: string; 
}

const MODULE_LABELS: Record<string, string> = {
  [AppView.READING]: 'Reading',
  [AppView.LISTENING]: 'Listening',
  [AppView.GRAMMAR]: 'Grammar',
  [AppView.LIVE]: 'Speaking',
};

const MODULE_COLORS: Record<string, string> = {
  [AppView.READING]: 'bg-blue-500',
  [AppView.LISTENING]: 'bg-purple-500',
  [AppView.GRAMMAR]: 'bg-indigo-500',
  [AppView.LIVE]: 'bg-rose-500',
};

// Hex Colors for SVG Charts
const CHART_HEX_COLORS: Record<string, string> = {
  [AppView.READING]: '#3b82f6', // Blue
  [AppView.LISTENING]: '#a855f7', // Purple
  [AppView.GRAMMAR]: '#6366f1', // Indigo
  [AppView.LIVE]: '#f43f5e', // Rose
};

// Text color mapping for charts
const TEXT_COLORS: Record<string, string> = {
  [AppView.READING]: 'text-blue-500',
  [AppView.LISTENING]: 'text-purple-500',
  [AppView.GRAMMAR]: 'text-indigo-500',
  [AppView.LIVE]: 'text-rose-500',
};

// --- HELPERS (Moved Out) ---

const getBadgeSeriesKey = (id: string) => {
    return id.split('_')[0];
};

const getBadgeSeriesLabel = (key: string) => {
    const labels: Record<string, string> = {
        scholar: 'Learning Scholar',
        streak: 'Consistency Streak',
        vocab: 'Vocabulary Master',
        acc: 'Accuracy Sharpshooter',
        islamic: 'Islamic Studies',
        time: 'Time Management',
        dedication: 'XP Dedication',
        topic: 'Topic Explorer',
        game: 'Game Mastery'
    };
    return labels[key] || 'Achievement';
};

const getTierColor = (tier: string) => {
    switch (tier) {
        case 'bronze': return 'from-orange-100 to-orange-300 text-orange-800 border-orange-200';
        case 'silver': return 'from-slate-100 to-slate-300 text-slate-800 border-slate-200';
        case 'gold': return 'from-yellow-100 to-yellow-300 text-yellow-800 border-yellow-200';
        case 'platinum': return 'from-cyan-100 to-cyan-300 text-cyan-800 border-cyan-200';
        default: return 'from-gray-100 to-gray-200 text-gray-500 border-gray-200';
    }
};

const getMaxValue = (dataSet: { value: number }[], metric: MetricType) => {
  if (metric === 'score' || metric === 'accuracy') return 100;
  const max = Math.max(...dataSet.map(s => s.value));
  return max === 0 ? 10 : Math.ceil(max * 1.2);
};

const formatCardDuration = (seconds: number) => {
  if (!seconds) return '0m';
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
};

const KEY_QUOTE_DATA = 'lovelya_quote_data';
const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;

// --- EXTERNAL CHART COMPONENTS ---

const AreaChart = ({ data, metric, moduleId }: { data: ChartDataPoint[], metric: MetricType, moduleId: string }) => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    
    // Config
    const height = 250;
    const paddingX = 20;
    const paddingY = 20;
    const pointSpacing = 60; // Fixed spacing between points to allow scrolling
    
    // Ensure sufficient width for all points
    const minWidth = 600;
    const contentWidth = Math.max(minWidth, (data.length - 1) * pointSpacing + (paddingX * 2));
    
    const maxVal = getMaxValue(data, metric);
    
    // Map Value to Y Coordinate (Inverted because SVG Y=0 is top)
    const getY = (val: number) => {
        const usableHeight = height - (paddingY * 2); 
        return height - paddingY - (val / maxVal) * usableHeight;
    };

    // Map Index to X Coordinate
    const getX = (index: number) => paddingX + (index * pointSpacing);

    // Build Path string
    if (data.length === 0) return <div className="h-full flex items-center justify-center text-gray-400">No Data Available</div>;

    let pathD = `M ${getX(0)} ${getY(data[0].value)}`;
    for (let i = 1; i < data.length; i++) {
        pathD += ` L ${getX(i)} ${getY(data[i].value)}`;
    }

    // Area Path (closes the loop at the bottom)
    const areaD = `${pathD} L ${getX(data.length - 1)} ${height} L ${getX(0)} ${height} Z`;

    const hexColor = CHART_HEX_COLORS[moduleId] || '#3b82f6';

    return (
        <div className="w-full h-full overflow-x-auto custom-scrollbar relative">
            <svg width={contentWidth} height={height} className="overflow-visible">
                <defs>
                    <linearGradient id={`gradient-${moduleId}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={hexColor} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={hexColor} stopOpacity="0.0" />
                    </linearGradient>
                </defs>

                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const y = height - paddingY - (ratio * (height - paddingY * 2));
                    return (
                        <line 
                            key={ratio} 
                            x1="0" y1={y} x2={contentWidth} y2={y} 
                            stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4"
                            className="dark:stroke-gray-700"
                        />
                    );
                })}

                <path d={areaD} fill={`url(#gradient-${moduleId})`} />
                <path d={pathD} fill="none" stroke={hexColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                {data.map((d, i) => {
                    const x = getX(i);
                    const y = getY(d.value);
                    const isHovered = hoverIndex === i;

                    return (
                        <g 
                            key={i} 
                            onMouseEnter={() => setHoverIndex(i)} 
                            onMouseLeave={() => setHoverIndex(null)}
                            className="cursor-pointer"
                        >
                            <circle cx={x} cy={y} r="15" fill="transparent" />
                            <circle 
                                cx={x} cy={y} r={isHovered ? 6 : 4} 
                                fill={hexColor} stroke="white" strokeWidth="2"
                                className="transition-all duration-200 dark:stroke-gray-800"
                            />
                            <text 
                                x={x} y={height - 2} 
                                textAnchor="middle" 
                                fontSize="10" 
                                fill="currentColor"
                                className="text-gray-400 dark:text-gray-500 font-bold"
                            >
                                {d.label}
                            </text>
                            {isHovered && (
                                <g>
                                    <rect x={x - 20} y={y - 35} width="40" height="25" rx="5" fill={hexColor} />
                                    <text x={x} y={y - 19} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">{d.value}</text>
                                    <path d={`M ${x} ${y-10} L ${x-4} ${y-10} L ${x} ${y-6} L ${x+4} ${y-10} Z`} fill={hexColor} />
                                </g>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

const DonutChart = ({ stats, metric }: { stats: ModuleStat[], metric: MetricType }) => {
    const [hoveredStat, setHoveredStat] = useState<ModuleStat | null>(null);

    const getVal = (stat: ModuleStat) => {
        switch (metric) {
            case 'score': return stat.avgScore;
            case 'accuracy': return stat.avgAccuracy;
            case 'duration': return Math.round(stat.totalDuration / 60); 
            case 'attempts': return stat.attempts;
            default: return 0;
        }
    };

    const total = stats.reduce((acc, curr) => acc + getVal(curr), 0);
    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    if (total === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <div className="w-56 h-56 rounded-full border-8 border-gray-100 dark:border-gray-700 flex items-center justify-center">
                    <span className="text-xs font-bold">No Data</span>
                </div>
            </div>
        );
    }

    let cumulativePercent = 0;
    const centerLabel = hoveredStat ? MODULE_LABELS[hoveredStat.module] : 'Total';
    const centerValue = hoveredStat 
        ? (metric === 'duration' ? formatCardDuration(getVal(hoveredStat) * 60) : getVal(hoveredStat))
        : (metric === 'duration' ? formatCardDuration(total * 60) : total);
    
    const centerSub = hoveredStat ? `${Math.round((getVal(hoveredStat) / total) * 100)}%` : '';

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 h-full w-full py-2 md:py-4">
            <div className="relative w-40 h-40 md:w-64 md:h-64 flex-shrink-0 group select-none">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 overflow-visible">
                    {stats.map((stat) => {
                        const val = getVal(stat);
                        const percent = total > 0 ? val / total : 0;
                        const strokeLength = percent * circumference;
                        const offset = cumulativePercent * circumference;
                        const dashArray = `${strokeLength} ${circumference}`;
                        cumulativePercent += percent;
                        
                        let strokeColor = '#9CA3AF'; 
                        if (stat.module === AppView.READING) strokeColor = '#3B82F6';
                        if (stat.module === AppView.LISTENING) strokeColor = '#A855F7';
                        if (stat.module === AppView.GRAMMAR) strokeColor = '#6366F1';
                        if (stat.module === AppView.LIVE) strokeColor = '#F43F5E';

                        const isHovered = hoveredStat?.module === stat.module;

                        return (
                            <circle
                                key={stat.module}
                                cx="50" cy="50" r={radius} 
                                fill="transparent"
                                stroke={strokeColor}
                                strokeWidth={isHovered ? "12" : "10"} 
                                strokeDasharray={dashArray}
                                strokeDashoffset={-offset} 
                                strokeLinecap="butt"
                                className={`transition-all duration-300 cursor-pointer ${isHovered ? 'opacity-100 drop-shadow-md brightness-110' : 'opacity-90 hover:opacity-100'}`}
                                onMouseEnter={() => setHoveredStat(stat)}
                                onMouseLeave={() => setHoveredStat(null)}
                                style={{ transformOrigin: 'center' }}
                            />
                        );
                    })}
                    <circle cx="50" cy="50" r="33" fill="transparent" stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-gray-700 pointer-events-none opacity-50" />
                </svg>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-300">
                    <span className={`text-xs font-bold uppercase tracking-widest mb-1 transition-colors ${hoveredStat ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400'}`}>
                        {centerLabel}
                    </span>
                    <span className={`text-3xl font-black leading-none transition-transform duration-300 ${hoveredStat ? 'scale-110 text-lovelya-600 dark:text-lovelya-400' : 'text-gray-800 dark:text-white'}`}>
                        {centerValue}
                    </span>
                    {centerSub && (
                        <div className="mt-1 animate-fade-in">
                            <span className="text-xs font-bold text-white bg-gray-800 dark:bg-gray-600 px-2 py-0.5 rounded-full shadow-sm">
                                {centerSub}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3 w-full md:w-auto">
                {stats.map((stat) => {
                    const val = getVal(stat);
                    const percent = Math.round((val / total) * 100);
                    const isHovered = hoveredStat?.module === stat.module;
                    
                    return (
                        <div 
                            key={stat.module} 
                            onMouseEnter={() => setHoveredStat(stat)}
                            onMouseLeave={() => setHoveredStat(null)}
                            className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl transition cursor-pointer border ${isHovered ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 shadow-sm scale-105' : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                        >
                            <div className={`w-3 h-3 rounded-full shadow-sm ${MODULE_COLORS[stat.module]} ${isHovered ? 'ring-2 ring-offset-2 ring-gray-200 dark:ring-gray-700' : ''}`}></div>
                            <div className="flex-1">
                                <div className={`text-sm font-bold transition ${isHovered ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {MODULE_LABELS[stat.module]}
                                </div>
                                <div className="text-xs text-gray-400 font-medium">
                                    {metric === 'duration' ? formatCardDuration(val*60) : val} • {percent}%
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

const ProfileModule: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [showBadges, setShowBadges] = useState(true);
  
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
  const [compareMetric, setCompareMetric] = useState<MetricType>('score');
  const [chartType, setChartType] = useState<ChartType>('bar'); 

  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [modalTimeFilter, setModalTimeFilter] = useState<TimeFilter>('week');
  const [modalMetric, setModalMetric] = useState<MetricType>('score');
  
  const [selectedBadgeSeries, setSelectedBadgeSeries] = useState<string | null>(null);

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isRefreshingQuote, setIsRefreshingQuote] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [appLanguage, setAppLanguageState] = useState(getAppLanguage());

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refreshData();
    initializeQuote();
  }, []);

  const initializeQuote = () => {
    const stored = localStorage.getItem(KEY_QUOTE_DATA);
    const now = Date.now();
    let index = 0;

    if (stored) {
        try {
            const { idx, timestamp } = JSON.parse(stored);
            if (now - timestamp > EIGHT_HOURS_MS) {
                index = Math.floor(Math.random() * ISLAMIC_QUOTES.length);
                localStorage.setItem(KEY_QUOTE_DATA, JSON.stringify({ idx: index, timestamp: now }));
            } else {
                index = idx;
            }
        } catch (e) {
            index = Math.floor(Math.random() * ISLAMIC_QUOTES.length);
            localStorage.setItem(KEY_QUOTE_DATA, JSON.stringify({ idx: index, timestamp: now }));
        }
    } else {
        index = Math.floor(Math.random() * ISLAMIC_QUOTES.length);
        localStorage.setItem(KEY_QUOTE_DATA, JSON.stringify({ idx: index, timestamp: now }));
    }
    setQuoteIndex(index);
  };

  const handleRefreshQuote = () => {
    setIsRefreshingQuote(true);
    setTimeout(() => {
        let newIndex = Math.floor(Math.random() * ISLAMIC_QUOTES.length);
        if (ISLAMIC_QUOTES.length > 1) {
            while (newIndex === quoteIndex) {
                newIndex = Math.floor(Math.random() * ISLAMIC_QUOTES.length);
            }
        }
        setQuoteIndex(newIndex);
        localStorage.setItem(KEY_QUOTE_DATA, JSON.stringify({ idx: newIndex, timestamp: Date.now() }));
        setIsRefreshingQuote(false);
    }, 500);
  };

  const refreshData = () => {
    const user = getUserProfile();
    const activities = getActivityLogs();
    const vocab = getVocab();
    
    setProfile(user);
    setLogs(activities);
    
    let currentStreak = 0;
    if (activities.length > 0) {
        const sorted = [...activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const today = new Date().setHours(0,0,0,0);
        let lastDate = new Date(sorted[0].date).setHours(0,0,0,0);
        
        if (lastDate === today || lastDate === today - 86400000) {
            currentStreak = 1;
            for (let i = 1; i < sorted.length; i++) {
                const d = new Date(sorted[i].date).setHours(0,0,0,0);
                if (d === lastDate) continue;
                if (d === lastDate - 86400000) {
                    currentStreak++;
                    lastDate = d;
                } else {
                    break; 
                }
            }
        }
    }

    const unlocked: Badge[] = [];
    BADGE_DEFINITIONS.forEach(def => {
         let isUnlocked = false;
         if (def.id.includes('scholar') && activities.length >= (def.id === 'scholar_bronze' ? 1 : def.id === 'scholar_silver' ? 10 : 50)) isUnlocked = true;
         if (def.id.includes('streak') && currentStreak >= (def.id === 'streak_bronze' ? 3 : def.id === 'streak_silver' ? 7 : 30)) isUnlocked = true;
         if (def.id.includes('vocab') && vocab.length >= (def.id === 'vocab_bronze' ? 10 : def.id === 'vocab_silver' ? 50 : 100)) isUnlocked = true;
         
         if (def.id.includes('dedication')) {
             const xp = user.xp || 0;
             if (def.id === 'dedication_iron' && xp >= 1000) isUnlocked = true;
             if (def.id === 'dedication_diamond' && xp >= 5000) isUnlocked = true;
             if (def.id === 'dedication_legend' && xp >= 25000) isUnlocked = true;
         }

         if (def.id.includes('game_general')) {
             const categories = ['visual', 'grammar_strike', 'odd_one_out', 'arcade', 'scramble', 'knowledge', 'interpreter', 'read_aloud'];
             const maxLevel = Math.max(...categories.map(cat => getGameProgress(cat, 'general')));
             if (def.id === 'game_general_bronze' && maxLevel > 5) isUnlocked = true;
             if (def.id === 'game_general_silver' && maxLevel > 10) isUnlocked = true;
             if (def.id === 'game_general_gold' && maxLevel > 20) isUnlocked = true;
         }

         if (def.id.includes('game_islamic')) {
             const categories = ['visual', 'grammar_strike', 'odd_one_out', 'arcade', 'scramble', 'knowledge', 'interpreter', 'read_aloud'];
             const maxLevel = Math.max(...categories.map(cat => getGameProgress(cat, 'islamic')));
             if (def.id === 'game_islamic_bronze' && maxLevel > 5) isUnlocked = true;
             if (def.id === 'game_islamic_silver' && maxLevel > 10) isUnlocked = true;
             if (def.id === 'game_islamic_gold' && maxLevel > 20) isUnlocked = true;
         }

         if (isUnlocked) {
             unlocked.push({ ...def, unlockedDate: new Date().toISOString() });
         }
    });
    setEarnedBadges(unlocked);
  };

  const earnedBadgeIds = useMemo(() => new Set(earnedBadges.map(b => b.id)), [earnedBadges]);

  const badgeSeries = useMemo(() => {
    const groups: Record<string, typeof BADGE_DEFINITIONS> = {};
    BADGE_DEFINITIONS.forEach(def => {
        const key = getBadgeSeriesKey(def.id);
        if (!groups[key]) groups[key] = [];
        groups[key].push(def);
    });
    return groups;
  }, []);

  // --- ANALYTICS LOGIC ---
  const getLogsByTime = (filter: TimeFilter) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
    const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).getTime();

    return logs.filter(log => {
      if (log.type === AppView.VOCAB) return false;
      const logTime = new Date(log.date).getTime();
      if (filter === 'today') return logTime >= startOfDay;
      if (filter === 'week') return logTime >= startOfWeek;
      if (filter === 'month') return logTime >= startOfMonth;
      return true;
    });
  };

  const moduleStats = useMemo(() => {
    const filtered = getLogsByTime(timeFilter);
    const stats: Record<string, ModuleStat> = {};
    Object.keys(MODULE_LABELS).forEach(key => {
      stats[key] = {
        module: key, totalScore: 0, totalAccuracy: 0, totalDuration: 0, attempts: 0, avgScore: 0, avgAccuracy: 0
      };
    });
    filtered.forEach(log => {
      if (stats[log.type]) {
        stats[log.type].totalScore += log.score || 0;
        stats[log.type].totalAccuracy += log.accuracy || 0;
        stats[log.type].totalDuration += log.durationSeconds || 0;
        stats[log.type].attempts += 1;
      }
    });
    Object.values(stats).forEach(stat => {
      if (stat.attempts > 0) {
        stat.avgScore = Math.round(stat.totalScore / stat.attempts);
        stat.avgAccuracy = Math.round(stat.totalAccuracy / stat.attempts);
      }
    });
    return Object.values(stats).filter(s => MODULE_LABELS[s.module]); 
  }, [logs, timeFilter]);

  const generateTrendData = (filter: TimeFilter, metric: MetricType, specificModule: string | null = null): ChartDataPoint[] => {
    let filtered = getLogsByTime(filter);
    if (specificModule) {
        filtered = filtered.filter(l => l.type === specificModule);
    }
    const dataPoints: { label: string; value: number; count: number; _key: string, colorClass: string }[] = [];
    const now = new Date();

    const generatePoint = (key: string, label: string) => ({ label, value: 0, count: 0, _key: key, colorClass: TEXT_COLORS[specificModule || ''] || 'text-gray-500' });

    if (filter === 'today') {
        for (let i = 0; i <= 23; i++) dataPoints.push(generatePoint(i.toString(), `${i}:00`));
        filtered.forEach(log => {
            const h = new Date(log.date).getHours().toString();
            const point = dataPoints.find(p => p._key === h);
            if (point) updatePoint(point, log, metric);
        });
    } else if (filter === 'week') {
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            dataPoints.push(generatePoint(d.toDateString(), d.toLocaleDateString('en-US', { weekday: 'short' })));
        }
        filtered.forEach(log => {
            const d = new Date(log.date).toDateString();
            const point = dataPoints.find(p => p._key === d);
            if (point) updatePoint(point, log, metric);
        });
    } else { 
        for (let i = 29; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            dataPoints.push(generatePoint(d.toDateString(), `${d.getDate()}/${d.getMonth() + 1}`));
        }
        filtered.forEach(log => {
            const d = new Date(log.date).toDateString();
            const point = dataPoints.find(p => p._key === d);
            if (point) updatePoint(point, log, metric);
        });
    }
    
    return dataPoints.map(p => ({
        label: p.label,
        value: p.count === 0 ? 0 : (metric === 'attempts' ? p.count : Math.round(p.value / p.count)),
        colorClass: p.colorClass
    }));
  };

  const updatePoint = (point: any, log: ActivityLog, metric: MetricType) => {
      let val = 0;
      if (metric === 'score') val = log.score;
      else if (metric === 'accuracy') val = log.accuracy;
      else if (metric === 'duration') val = log.durationSeconds / 60;
      else if (metric === 'attempts') val = 1;
      point.value += val;
      point.count += 1;
  };

  const modalStats = useMemo(() => {
      if (!selectedModule) return [];
      return generateTrendData(modalTimeFilter, modalMetric, selectedModule);
  }, [logs, selectedModule, modalTimeFilter, modalMetric]);

  const getMetricValue = (stat: ModuleStat) => {
    switch (compareMetric) {
      case 'score': return stat.avgScore;
      case 'accuracy': return stat.avgAccuracy;
      case 'duration': return Math.round(stat.totalDuration / 60); 
      case 'attempts': return stat.attempts;
      default: return 0;
    }
  };

  const getLevelInfo = (currentXp: number) => {
    let currentLevelObj = XP_THRESHOLDS[0];
    let nextLevelObj = XP_THRESHOLDS[1];
    for (let i = 0; i < XP_THRESHOLDS.length; i++) {
        if (currentXp >= XP_THRESHOLDS[i].min) {
            currentLevelObj = XP_THRESHOLDS[i];
            nextLevelObj = XP_THRESHOLDS[i + 1] || null; 
        } else {
            break;
        }
    }
    return { current: currentLevelObj, next: nextLevelObj };
  };

  const handleNameChange = (name: string) => {
    if (profile) {
        const updated = { ...profile, name };
        setProfile(updated);
        saveUserProfile(updated);
    }
  };

  const handleAvatarChange = (icon: string) => {
    if (profile) {
        const updated = { ...profile, avatar: icon, photoData: null as any };
        setProfile(updated);
        saveUserProfile(updated);
        setShowAvatarModal(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      // Simple compression check (optional, but good for Firestore limits)
      if (base64.length > 200000) {
        alert('Image is too large (max 200KB). Please choose a smaller photo.');
        return;
      }
      const updated = { ...profile, photoData: base64 };
      setProfile(updated);
      saveUserProfile(updated);
      setShowAvatarModal(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSystemBackup = () => {
    const json = exportFullSystemBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `LovSpeak_Full_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSystemRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
        const text = evt.target?.result as string;
        if (text) {
            const result = importFullSystemBackup(text);
            if (result.success) {
                alert(result.message);
                refreshData();
            } else {
                alert("Error: " + result.message);
            }
        }
    };
    reader.readAsText(file);
    e.target.value = ''; 
  };

  const copyQuote = () => {
      navigator.clipboard.writeText(ISLAMIC_QUOTES[quoteIndex]);
      alert('Quote copied!');
  };

  const handleLanguageChange = (lang: 'id' | 'en') => {
    setAppLanguageState(lang);
    setAppLanguage(lang);
  };

  if (!profile) return <div>Loading...</div>;

  const { current: currentLvl, next: nextLvl } = getLevelInfo(profile.xp || 0);
  const xpProgress = nextLvl 
    ? ((profile.xp - currentLvl.min) / (nextLvl.min - currentLvl.min)) * 100 
    : 100;

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in pb-10">
        
        {/* Header Profile Section - Redesigned for Proportionality */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-white/40 dark:border-gray-700 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-lovelya-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                {/* Left: Avatar & Basic Info */}
                <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="relative group cursor-pointer mb-4" onClick={() => setShowAvatarModal(true)}>
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 p-1 rounded-full shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
                            <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center text-3xl md:text-4xl text-gray-800 dark:text-white overflow-hidden relative">
                                {profile.photoData ? (
                                    <img 
                                        src={profile.photoData} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <i className={`fas ${profile.avatar || 'fa-user'}`}></i>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <i className="fas fa-camera text-white opacity-0 group-hover:opacity-100 transition-opacity text-xl"></i>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-7 h-7 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg text-gray-500 border-2 border-white dark:border-gray-800 group-hover:scale-110 transition">
                            <i className="fas fa-camera text-[10px]"></i>
                        </div>
                    </div>
                    
                    <div className="space-y-1 w-full">
                        <input 
                            value={profile.name} 
                            onChange={e => handleNameChange(e.target.value)}
                            className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-lovelya-500 outline-none transition w-full text-center md:text-left py-1 truncate"
                        />
                        <div className="inline-flex items-center gap-2 bg-lovelya-50 dark:bg-lovelya-500/10 px-3 py-1 rounded-full border border-lovelya-100 dark:border-lovelya-500/20">
                            <span className="text-lovelya-600 dark:text-lovelya-400 text-[10px] font-black uppercase tracking-widest">{currentLvl.level}</span>
                            <span className="w-1 h-1 rounded-full bg-lovelya-300 dark:bg-lovelya-700"></span>
                            <span className="text-gray-700 dark:text-gray-200 text-[10px] font-bold">{currentLvl.title}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Stats & Quick Settings */}
                <div className="md:col-span-8 space-y-6">
                    {/* Progress Bar */}
                    <div className="bg-white dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                        <div className="flex justify-between items-center mb-2 text-[10px] md:text-xs font-black">
                            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                <i className="fas fa-bolt text-lovelya-500"></i>
                                {profile.xp} XP
                            </span>
                            <span className="text-lovelya-600 dark:text-lovelya-400 uppercase tracking-wider">
                                {nextLvl ? `${Math.round(xpProgress)}% to ${nextLvl.level}` : 'Max Level'}
                            </span>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-100 dark:bg-gray-800">
                            <div 
                                style={{ width: `${xpProgress}%` }} 
                                className="shadow-[0_0_15px_rgba(236,72,153,0.3)] flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-lovelya-400 via-fuchsia-500 to-purple-600 transition-all duration-1000 ease-out"
                            ></div>
                        </div>
                    </div>

                    {/* Quick Settings Grid - Hidden on Mobile, shown on Desktop/Tablet */}
                    <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* AI Language Quick Setting */}
                        <div className="bg-gray-50 dark:bg-gray-900/30 p-3 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">AI Language</label>
                            <div className="flex p-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                <button 
                                    onClick={() => handleLanguageChange('id')}
                                    className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition ${appLanguage === 'id' ? 'bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-600' : 'text-gray-400'}`}
                                >
                                    ID
                                </button>
                                <button 
                                    onClick={() => handleLanguageChange('en')}
                                    className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition ${appLanguage === 'en' ? 'bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-600' : 'text-gray-400'}`}
                                >
                                    EN
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Backup/Restore Buttons - Hidden on Mobile */}
                    <div className="hidden md:flex gap-3 justify-center md:justify-start">
                        <button onClick={handleSystemBackup} className="px-4 py-2 bg-gray-100 dark:bg-gray-700/50 rounded-xl shadow-sm text-[10px] font-black text-gray-600 dark:text-gray-300 hover:bg-lovelya-500 hover:text-white transition flex items-center gap-2 border border-transparent">
                            <i className="fas fa-cloud-download-alt"></i> Backup
                        </button>
                        <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-gray-100 dark:bg-gray-700/50 rounded-xl shadow-sm text-[10px] font-black text-gray-600 dark:text-gray-300 hover:bg-lovelya-500 hover:text-white transition flex items-center gap-2 border border-transparent">
                            <i className="fas fa-cloud-upload-alt"></i> Restore
                        </button>
                        <input type="file" accept=".json" ref={fileInputRef} onChange={handleSystemRestore} className="hidden" />
                    </div>
                </div>
            </div>
        </div>

        {/* --- WEEKLY AI INSIGHT --- */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 p-8 md:p-10 group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <i className="fas fa-brain text-8xl"></i>
            </div>
            <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center shadow-sm">
                        <i className="fas fa-sparkles"></i>
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest">Weekly AI Insight</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Personalized for {profile.name}</p>
                    </div>
                </div>
                
                <div className="p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-800/50">
                    <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                        "Your consistency in <span className="text-indigo-600 dark:text-indigo-400 font-bold">Shadowing Lab</span> has improved your pronunciation score by 12% this week. Focus on word stress in longer sentences to reach the next level!"
                    </p>
                </div>
            </div>
        </div>

        {/* --- ANALYTICS SECTION --- */}
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
               <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                   <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-xl">
                        <i className="fas fa-chart-pie"></i>
                   </span>
                   Performance Analytics
               </h3>
               <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex self-start sm:self-auto">
                   {(['today', 'week', 'month'] as TimeFilter[]).map((tf) => (
                       <button
                           key={tf}
                           onClick={() => setTimeFilter(tf)}
                           className={`px-4 md:px-5 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wide transition ${timeFilter === tf ? 'bg-white dark:bg-gray-600 text-lovelya-600 dark:text-white shadow-sm' : 'text-gray-500'}`}
                       >
                           {tf}
                       </button>
                   ))}
               </div>
            </div>

            {/* Skill Comparison Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-5 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                    <div>
                        <h4 className="font-bold text-lg text-gray-800 dark:text-white">Skill Comparison</h4>
                        <p className="text-sm text-gray-500">
                            Compare your strength across modules.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                        <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex self-start">
                            <button onClick={() => setChartType('bar')} className={`px-3 py-2 rounded-lg text-xs font-bold transition ${chartType === 'bar' ? 'bg-white dark:bg-gray-600 shadow text-gray-800 dark:text-white' : 'text-gray-500'}`} title="Bar Chart"><i className="fas fa-chart-bar"></i></button>
                            <button onClick={() => setChartType('donut')} className={`px-3 py-2 rounded-lg text-xs font-bold transition ${chartType === 'donut' ? 'bg-white dark:bg-gray-600 shadow text-gray-800 dark:text-white' : 'text-gray-500'}`} title="Donut Chart"><i className="fas fa-chart-pie"></i></button>
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 flex-1 custom-scrollbar scrollbar-hide">
                            {(['score', 'accuracy', 'duration', 'attempts'] as MetricType[]).map(metric => (
                                <button
                                    key={metric}
                                    onClick={() => setCompareMetric(metric)}
                                    className={`px-3 md:px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold border transition whitespace-nowrap ${compareMetric === metric ? 'bg-lovelya-50 dark:bg-lovelya-900/20 border-lovelya-500 text-lovelya-700 dark:text-lovelya-300' : 'border-gray-200 dark:border-gray-600 text-gray-500'}`}
                                >
                                    {metric.charAt(0).toUpperCase() + metric.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            <div className="h-[350px] md:h-[400px] relative">
                {chartType === 'bar' ? (
                        <div className="h-full flex items-end justify-between gap-4">
                            {moduleStats.map((stat) => {
                                const val = getMetricValue(stat);
                                const max = getMaxValue(moduleStats.map(s => ({ value: getMetricValue(s) })), compareMetric);
                                const percent = Math.min((val / max) * 100, 100);
                                const label = MODULE_LABELS[stat.module];
                                
                                return (
                                    <div key={stat.module} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                                        <div className="mb-3 text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-lovelya-600 transition-colors bg-white dark:bg-gray-700 px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300 absolute bottom-full">
                                            {val}
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-2xl relative overflow-hidden flex items-end h-full">
                                            <div 
                                                className={`w-full rounded-t-xl transition-all duration-700 ease-out ${MODULE_COLORS[stat.module]} opacity-80 group-hover:opacity-100`}
                                                style={{ height: `${percent}%`, minHeight: percent > 0 ? '6px' : '0' }}
                                            ></div>
                                        </div>
                                        <div className="mt-4 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider text-center h-8 flex items-center justify-center w-full break-words leading-tight">
                                            {label}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <DonutChart stats={moduleStats} metric={compareMetric} />
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {moduleStats.map((stat) => {
                    const label = MODULE_LABELS[stat.module];
                    const color = MODULE_COLORS[stat.module];
                    const isSpeaking = stat.module === AppView.LIVE;
                    const displayValue = isSpeaking ? formatCardDuration(stat.totalDuration) : stat.avgScore;
                    const displayUnit = isSpeaking ? '' : '%';
                    const displayLabel = isSpeaking ? 'Duration' : 'Avg Score';

                    return (
                        <div 
                            key={stat.module} 
                            onClick={() => {
                                setSelectedModule(stat.module);
                                setModalTimeFilter(timeFilter); 
                                setModalMetric(compareMetric); 
                            }}
                            className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:scale-[1.02] hover:border-lovelya-200 cursor-pointer transition-all duration-300 group flex flex-col justify-between h-full"
                        >
                            <div className="flex items-start justify-between mb-3 md:mb-4">
                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-white text-lg md:text-xl shadow-md ${color} group-hover:shadow-lg transition`}>
                                    <i className={`fas ${
                                        stat.module === AppView.READING ? 'fa-book-open' :
                                        stat.module === AppView.LISTENING ? 'fa-headphones' :
                                        stat.module === AppView.GRAMMAR ? 'fa-spell-check' :
                                        stat.module === AppView.LIVE ? 'fa-microphone-alt' :
                                        'fa-star'
                                    }`}></i>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg md:text-2xl font-black text-gray-800 dark:text-gray-100">
                                        {displayValue}<span className="text-xs md:text-sm text-gray-400">{displayUnit}</span>
                                    </div>
                                    <div className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase">{displayLabel}</div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-bold text-gray-700 dark:text-gray-200 text-sm md:text-lg mb-1 truncate">{label}</h4>
                                <div className="flex justify-between items-center text-[10px] md:text-xs text-gray-500 mt-1">
                                    <span>{stat.attempts} Sess.</span>
                                    <i className="fas fa-chevron-right text-gray-300 group-hover:text-lovelya-500 transition"></i>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* --- BADGES SECTION --- */}
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-lovelya-100 dark:bg-lovelya-900/30 text-lovelya-600 flex items-center justify-center text-xl">
                        <i className="fas fa-award"></i>
                    </span>
                    Achievements & Badges
                </h3>
                <button 
                    onClick={() => setShowBadges(!showBadges)}
                    className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-lovelya-600 transition flex items-center gap-2"
                >
                    {showBadges ? 'Hide' : 'Show'} <i className={`fas fa-chevron-${showBadges ? 'up' : 'down'}`}></i>
                </button>
            </div>

            <AnimatePresence>
                {showBadges && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                            {Object.entries(badgeSeries).map(([seriesKey, rawBadges]) => {
                                const badges = rawBadges as typeof BADGE_DEFINITIONS;
                                const unlockedBadges = badges.filter(b => earnedBadgeIds.has(b.id));
                                const highestUnlocked = unlockedBadges[unlockedBadges.length - 1];
                                const displayBadge = highestUnlocked || badges[0];
                                const isUnlocked = !!highestUnlocked;
                                const progressStep = unlockedBadges.length;
                                const totalSteps = badges.length;
                                const progressPercent = (progressStep / totalSteps) * 100;

                                return (
                                    <div 
                                        key={seriesKey} 
                                        onClick={() => setSelectedBadgeSeries(seriesKey)}
                                        className={`relative bg-gray-50 dark:bg-gray-700/30 p-3 md:p-5 rounded-2xl border transition-all cursor-pointer group hover:scale-[1.02] hover:shadow-md ${isUnlocked ? 'border-gray-200 dark:border-gray-600' : 'border-dashed border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100'}`}
                                    >
                                        <div className="flex flex-col items-center text-center">
                                            <div className={`w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-3xl mb-2 md:mb-3 shadow-sm transform transition duration-500 bg-gradient-to-br ${isUnlocked ? getTierColor(displayBadge.tier) : 'from-gray-100 to-gray-200 text-gray-300 dark:from-gray-600 dark:to-gray-700 dark:text-gray-500'} group-hover:scale-110`}>
                                                <i className={`fas ${displayBadge.icon}`}></i>
                                            </div>
                                            <h4 className="font-bold text-xs md:text-sm text-gray-800 dark:text-gray-100 mb-0.5 md:mb-1 line-clamp-1 w-full truncate">{getBadgeSeriesLabel(seriesKey)}</h4>
                                            <p className="text-[8px] md:text-[10px] text-gray-500 dark:text-gray-400 font-medium mb-2 md:mb-3 uppercase tracking-wider w-full truncate">
                                                {isUnlocked ? displayBadge.name : 'Locked'}
                                            </p>
                                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1 md:h-1.5 overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-500 ${isUnlocked ? 'bg-green-500' : 'bg-gray-300'}`} 
                                                    style={{ width: `${progressPercent}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between w-full text-[8px] md:text-[9px] text-gray-400 mt-1 font-bold">
                                                <span>Lvl {progressStep}</span>
                                                <span>Max {totalSteps}</span>
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition rounded-2xl pointer-events-none">
                                            <span className="bg-white dark:bg-gray-800 text-[10px] md:text-xs px-2 py-1 rounded shadow-sm font-bold text-gray-600 dark:text-gray-200">Details</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Detailed Module Modal */}
        {selectedModule && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-3xl shadow-2xl p-6 md:p-8 animate-slide-up flex flex-col max-h-[90vh]">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg ${MODULE_COLORS[selectedModule]}`}>
                                <i className={`fas ${
                                    selectedModule === AppView.READING ? 'fa-book-open' :
                                    selectedModule === AppView.LISTENING ? 'fa-headphones' :
                                    selectedModule === AppView.GRAMMAR ? 'fa-spell-check' :
                                    selectedModule === AppView.LIVE ? 'fa-microphone-alt' :
                                    'fa-star'
                                }`}></i>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{MODULE_LABELS[selectedModule]} Performance</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Detailed analytics and progress trends.</p>
                            </div>
                        </div>
                        <button onClick={() => setSelectedModule(null)} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white transition">
                            <i className="fas fa-times text-lg"></i>
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex">
                            {(['today', 'week', 'month'] as TimeFilter[]).map((tf) => (
                                <button
                                    key={tf}
                                    onClick={() => setModalTimeFilter(tf)}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition ${modalTimeFilter === tf ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm' : 'text-gray-500'}`}
                                >
                                    {tf}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-1 w-full md:w-auto custom-scrollbar">
                            {(['score', 'accuracy', 'duration', 'attempts'] as MetricType[]).map(metric => (
                                <button
                                    key={metric}
                                    onClick={() => setModalMetric(metric)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition whitespace-nowrap ${modalMetric === metric ? `${MODULE_COLORS[selectedModule]} text-white border-transparent shadow-md` : 'border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                >
                                    {metric.charAt(0).toUpperCase() + metric.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 min-h-[300px] bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 relative flex flex-col">
                        <AreaChart data={modalStats} metric={modalMetric} moduleId={selectedModule} />
                    </div>
                    
                    <div className="text-center text-xs text-gray-400 mt-4 font-medium italic">
                        Displaying {modalMetric} data for {modalTimeFilter}. Scroll to see more.
                    </div>
                </div>
            </div>
        )}

        {/* Avatar Modal */}
        {showAvatarModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl shadow-2xl p-6 animate-slide-up">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Choose Avatar</h3>
                        <button onClick={() => setShowAvatarModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
                    </div>
                    <div className="grid grid-cols-5 gap-3 max-h-[60vh] overflow-y-auto p-2">
                        <button 
                            onClick={() => document.getElementById('photo-upload-input')?.click()}
                            className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-xl transition bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-600 hover:bg-lovelya-100"
                            title="Upload Photo"
                        >
                            <i className="fas fa-upload text-sm"></i>
                            <span className="text-[8px] font-bold mt-1">Upload</span>
                        </button>
                        <input 
                            id="photo-upload-input"
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handlePhotoUpload}
                        />
                        {AVATAR_ICONS.map(icon => (
                            <button 
                                key={icon} 
                                onClick={() => handleAvatarChange(icon)}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition hover:bg-lovelya-100 dark:hover:bg-gray-700 ${profile.avatar === icon ? 'bg-lovelya-500 text-white' : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300'}`}
                            >
                                <i className={`fas ${icon}`}></i>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ProfileModule;
