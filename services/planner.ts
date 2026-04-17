
import { AppView, DailyTask, Level } from '../types';

// This acts as the "AI" logic to structure the learning path
export const generateDailyTasks = (
  targetIds: string[], 
  intensityId: string, 
  level: Level
): DailyTask[] => {
  const tasks: DailyTask[] = [];
  const timestamp = Date.now();

  // 1. Determine number of tasks (Random 4-7 range)
  // Intensity argument is kept for compatibility but count is now randomized as requested
  const minTasks = 4;
  const maxTasks = 7;
  const taskCount = Math.floor(Math.random() * (maxTasks - minTasks + 1)) + minTasks;

  // 2. Task Generation: Priority Picking Logic
  // Instead of a single random pool, we want to ensure that if a user has selected targets (weaknesses),
  // at least ONE task for each target is included before filling the rest with random tasks.

  const targetTaskMap: Record<string, Omit<DailyTask, 'id' | 'isCompleted'>[]> = {};
  const fillerTasks: Omit<DailyTask, 'id' | 'isCompleted'>[] = [];

  // Helper to add tasks to specific target buckets
  const populateTasks = () => {
    // Speaking
    targetTaskMap['speaking'] = [
        { title: 'Pronunciation Warm-up', description: `Read a ${level} level text aloud and get AI feedback.`, moduleView: AppView.READING, icon: 'fa-book-reader' },
        { title: 'Conversation Simulation', description: 'Roleplay a specific scenario with the AI. Topic: Daily greetings.', moduleView: AppView.LIVE, icon: 'fa-microphone-alt' },
        { title: 'Speak & Translate', description: 'Translate a sentence by speaking it aloud.', moduleView: AppView.TRANSLATE, icon: 'fa-language' },
        { title: 'Fluent Storytelling', description: 'Tell a short story about your weekend to the Live AI.', moduleView: AppView.LIVE, icon: 'fa-comment-dots' }
    ];

    // Grammar
    targetTaskMap['grammar'] = [
        { title: 'Grammar Diagnostic', description: 'Write a short paragraph and let AI correct your structure.', moduleView: AppView.GRAMMAR, icon: 'fa-spell-check' },
        { title: 'Sentence Analysis', description: `Analyze a ${level} reading passage for sentence structures.`, moduleView: AppView.READING, icon: 'fa-search' },
        { title: 'Correction Challenge', description: 'Find errors in your own previous writings.', moduleView: AppView.GRAMMAR, icon: 'fa-edit' },
        { title: 'Live Grammar Quiz', description: 'Ask the AI to quiz you on verb tenses verbally.', moduleView: AppView.LIVE, icon: 'fa-question-circle' }
    ];

    // Vocab
    targetTaskMap['vocab'] = [
        { title: 'Vocab Hunt', description: 'Find and save 5 new words from a Reading session.', moduleView: AppView.READING, icon: 'fa-binoculars' },
        { title: 'Category Expansion', description: 'Add 3 new words to a custom category.', moduleView: AppView.VOCAB, icon: 'fa-plus-circle' },
        { title: 'Translation Practice', description: 'Translate 5 common idioms or phrases.', moduleView: AppView.TRANSLATE, icon: 'fa-exchange-alt' },
        { title: 'Word Usage Chat', description: 'Use 3 new words in a conversation with the AI.', moduleView: AppView.LIVE, icon: 'fa-comments' }
    ];

    // Islamic
    targetTaskMap['islamic'] = [
        { title: 'Islamic Reading', description: 'Read a story about the Prophets or Sahabah.', moduleView: AppView.READING, icon: 'fa-moon' },
        { title: 'Islamic Vocabulary', description: 'Review the "Islamic Terms" vocabulary list.', moduleView: AppView.VOCAB, icon: 'fa-mosque' },
        { title: 'Faith Discussion', description: 'Discuss the importance of patience (Sabr) with the AI.', moduleView: AppView.LIVE, icon: 'fa-hands-praying' },
        { title: 'Prophet Stories', description: 'Ask the AI to tell you a short story about a Prophet.', moduleView: AppView.LIVE, icon: 'fa-book-open' }
    ];

    // Business
    targetTaskMap['business'] = [
        { title: 'Formal Reading', description: 'Read a text about Work & Career.', moduleView: AppView.READING, icon: 'fa-briefcase' },
        { title: 'Email Drafting', description: 'Draft a professional email in the Grammar checker.', moduleView: AppView.GRAMMAR, icon: 'fa-envelope' },
        { title: 'Interview Prep', description: 'Simulate a job interview introduction with the AI.', moduleView: AppView.LIVE, icon: 'fa-user-tie' },
        { title: 'Negotiation Practice', description: 'Roleplay a salary negotiation scenario.', moduleView: AppView.LIVE, icon: 'fa-handshake' }
    ];

    // Travel (Moved from filler to target)
    targetTaskMap['travel'] = [
        { title: 'Airport Roleplay', description: 'Simulate checking in at an airport.', moduleView: AppView.LIVE, icon: 'fa-plane-departure' },
        { title: 'Directions Practice', description: 'Practice asking for and giving directions.', moduleView: AppView.TRANSLATE, icon: 'fa-map-signs' },
        { title: 'Hotel Booking', description: 'Roleplay booking a hotel room.', moduleView: AppView.LIVE, icon: 'fa-hotel' },
        { title: 'Travel Vocab', description: 'Learn 5 essential words for traveling.', moduleView: AppView.VOCAB, icon: 'fa-suitcase' }
    ];

    // Listening (New Bucket)
    targetTaskMap['listening'] = [
        { title: 'Active Listening', description: 'Listen to a dialogue and answer questions.', moduleView: AppView.LISTENING, icon: 'fa-headphones' },
        { title: 'Dictation Challenge', description: 'Listen to a sentence and write it down.', moduleView: AppView.LISTENING, icon: 'fa-pen' },
        { title: 'Podcast Summary', description: 'Listen to a monologue and summarize it.', moduleView: AppView.LISTENING, icon: 'fa-file-audio' }
    ];

    // Writing (New Bucket)
    targetTaskMap['writing'] = [
        { title: 'Daily Journal', description: 'Write 3 sentences about your day.', moduleView: AppView.GRAMMAR, icon: 'fa-book' },
        { title: 'Essay Intro', description: 'Draft an introduction for an essay topic.', moduleView: AppView.GRAMMAR, icon: 'fa-paragraph' },
        { title: 'Creative Story', description: 'Write a short story based on a prompt.', moduleView: AppView.CHAT, icon: 'fa-pencil-alt' }
    ];

    // Pronunciation (New Bucket)
    targetTaskMap['pronunciation'] = [
        { title: 'Tongue Twisters', description: 'Master a difficult tongue twister.', moduleView: AppView.GAMES, icon: 'fa-microphone-lines' },
        { title: 'Shadowing Practice', description: 'Listen and repeat sentences instantly.', moduleView: AppView.READING, icon: 'fa-clone' },
        { title: 'Minimal Pairs', description: 'Distinguish similar sounding words.', moduleView: AppView.READING, icon: 'fa-equals' }
    ];

    // Academic (New Bucket)
    targetTaskMap['academic'] = [
        { title: 'Academic Article', description: 'Read a complex article on science or history.', moduleView: AppView.READING, icon: 'fa-university' },
        { title: 'Formal Vocabulary', description: 'Learn 5 academic/formal words.', moduleView: AppView.VOCAB, icon: 'fa-graduation-cap' },
        { title: 'Debate Prep', description: 'Argue a point logically with the AI.', moduleView: AppView.LIVE, icon: 'fa-gavel' }
    ];

    // Idioms (New Bucket)
    targetTaskMap['idioms'] = [
        { title: 'Idiom of the Day', description: 'Learn and use a new idiom.', moduleView: AppView.VOCAB, icon: 'fa-lightbulb' },
        { title: 'Slang Chat', description: 'Have a casual chat using slang.', moduleView: AppView.CHAT, icon: 'fa-comments' },
        { title: 'Expression Hunt', description: 'Find idioms in a reading text.', moduleView: AppView.READING, icon: 'fa-search' }
    ];

    // General / Travel (Fillers)
    fillerTasks.push(
        { title: 'Daily Review', description: 'Review your vocabulary favorites.', moduleView: AppView.VOCAB, icon: 'fa-star' },
        { title: 'Free Talk', description: 'Chat about your day with the AI.', moduleView: AppView.LIVE, icon: 'fa-comments' },
        { title: 'Quick Translate', description: 'Translate 3 sentences from your native language.', moduleView: AppView.TRANSLATE, icon: 'fa-language' },
        { title: 'Game Break', description: 'Play a quick English game.', moduleView: AppView.GAMES, icon: 'fa-gamepad' }
    );
  };

  populateTasks();

  const selectedTasks: Omit<DailyTask, 'id' | 'isCompleted'>[] = [];
  const usedTypes = new Set<string>();

  // 3. Guaranteed Selection (Weighted Balancing)
  // Ensure at least 1 task from EACH selected target ID is included first
  targetIds.forEach(tid => {
      const bucket = targetTaskMap[tid];
      if (bucket && bucket.length > 0) {
          // Pick a random task from this bucket
          const randomTask = bucket[Math.floor(Math.random() * bucket.length)];
          selectedTasks.push(randomTask);
          usedTypes.add(randomTask.title); // Track to avoid immediate duplicates
      }
  });

  // 4. Fill the rest
  // Create a mixed pool of remaining target tasks AND filler tasks
  let remainingPool: Omit<DailyTask, 'id' | 'isCompleted'>[] = [...fillerTasks];
  
  // Add remaining tasks from selected targets to the pool to increase their weight
  targetIds.forEach(tid => {
      const bucket = targetTaskMap[tid];
      if (bucket) {
          remainingPool = [...remainingPool, ...bucket];
      }
  });

  // Shuffle remaining pool
  remainingPool = remainingPool.sort(() => 0.5 - Math.random());

  // Fill until taskCount is reached
  for (const task of remainingPool) {
      if (selectedTasks.length >= taskCount) break;
      if (!usedTypes.has(task.title)) {
          selectedTasks.push(task);
          usedTypes.add(task.title);
      }
  }

  // 5. Final Shuffle of the selected tasks so the priority ones aren't always at top
  const finalShuffled = selectedTasks.sort(() => 0.5 - Math.random());

  // 6. Assign IDs
  for (let i = 0; i < finalShuffled.length; i++) {
    tasks.push({
      id: `task-${timestamp}-${i}`,
      title: finalShuffled[i].title,
      description: finalShuffled[i].description,
      moduleView: finalShuffled[i].moduleView,
      icon: finalShuffled[i].icon,
      isCompleted: false,
    });
  }

  return tasks;
};

// --- NEW FUNCTION: Generate 30 Day CSV ---
export const generate30DayPlanCSV = (
  targetIds: string[], 
  intensityId: string, 
  level: Level
): string => {
  // CSV Header
  let csvContent = "Task Name,Date,Skill,Difficulty,Estimated Time,Status\n";

  // Map difficulty based on level
  let difficulty = 'Medium';
  if (['A1', 'A2'].includes(level)) difficulty = 'Easy';
  if (['C1', 'C2'].includes(level)) difficulty = 'Hard';

  // Map estimated time based on intensity
  let estimatedTime = '20'; // Default Regular
  if (intensityId === 'casual') estimatedTime = '10';
  if (intensityId === 'intensive') estimatedTime = '45';

  const today = new Date();

  // Generate 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD

    // Generate tasks for this specific iteration to get random variety
    const dailyTasks = generateDailyTasks(targetIds, intensityId, level);

    dailyTasks.forEach(task => {
        // Map ModuleView to Skill name for better reading in CSV
        let skill = 'General';
        if (task.moduleView === 'READING') skill = 'Reading';
        if (task.moduleView === 'LISTENING') skill = 'Listening';
        if (task.moduleView === 'GRAMMAR') skill = 'Grammar';
        if (task.moduleView === 'VOCAB') skill = 'Vocabulary';
        if (task.moduleView === 'LIVE') skill = 'Speaking';
        if (task.moduleView === 'TRANSLATE') skill = 'Translation';
        if (task.moduleView === 'CHAT') skill = 'Writing';

        // Escape commas in title
        const safeTitle = `"${task.title}"`;
        
        csvContent += `${safeTitle},${dateString},${skill},${difficulty},${estimatedTime},Not Started\n`;
    });
  }

  return csvContent;
};

// --- NEW FUNCTION: Generate Google Calendar URL ---
export const generateGoogleCalendarUrl = (intensityId: string): string => {
    // 1. Details
    const title = encodeURIComponent("LovSpeak English Practice");
    const details = encodeURIComponent("Daily English learning session with LovSpeak AI. Focus on completing daily tasks.");
    
    // Direct link to open the app on AI Studio with specific user context if needed
    const appLink = "https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221Fbc8JMRs8rX1n0eWqcjTizP5zVK8uIVJ%22%5D,%22action%22:%22open%22,%22userId%22:%22105539713539320366602%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing";
    const location = encodeURIComponent(appLink);
    
    // 2. Dates (YYYYMMDDTHHmmssZ)
    // Start tomorrow at 8:00 PM
    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(20, 0, 0, 0); 
    
    // End tomorrow at 8:30 PM (30 min duration default)
    const end = new Date(start);
    const durationMin = intensityId === 'casual' ? 15 : intensityId === 'intensive' ? 60 : 30;
    end.setMinutes(end.getMinutes() + durationMin);

    const formatGCalTime = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');
    
    const startStr = formatGCalTime(start);
    const endStr = formatGCalTime(end);

    // 3. Recurrence Rule (Daily for 30 days)
    const recur = encodeURIComponent("RRULE:FREQ=DAILY;COUNT=30");

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${startStr}/${endStr}&recur=${recur}&location=${location}`;
};
