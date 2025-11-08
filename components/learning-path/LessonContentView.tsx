'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  Award,
  Beaker,
  BookOpen,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Layers,
  Play,
  ShieldCheck,
  Sparkles,
  Target,
  LucideIcon,
} from 'lucide-react';

type IconName =
  | 'activity'
  | 'award'
  | 'beaker'
  | 'book-open'
  | 'brain'
  | 'check-circle'
  | 'clipboard-check'
  | 'compass'
  | 'layers'
  | 'play'
  | 'shield-check'
  | 'sparkles'
  | 'target';

const ICON_LIBRARY: Record<IconName, LucideIcon> = {
  activity: Activity,
  award: Award,
  beaker: Beaker,
  'book-open': BookOpen,
  brain: Brain,
  'check-circle': CheckCircle2,
  'clipboard-check': ClipboardCheck,
  compass: Compass,
  layers: Layers,
  play: Play,
  'shield-check': ShieldCheck,
  sparkles: Sparkles,
  target: Target,
};

type ObjectiveIcon = keyof typeof ICON_LIBRARY | string | null | undefined;

export type LessonHeroStat = {
  label: string;
  value: string;
  description?: string | null;
};

export type LessonObjective = {
  icon?: ObjectiveIcon;
  text: string;
};

export type LessonContentBlock =
  | {
      type: 'text';
      text: string;
      variant?: 'default' | 'lead';
    }
  | {
      type: 'list';
      style: 'unordered' | 'ordered';
      items: string[];
    }
  | {
      type: 'card-grid';
      columns?: number;
      cards: Array<{
        title: string;
        subtitle?: string | null;
        body?: string | null;
        bullets?: string[];
        variant?: 'accent' | 'neutral' | 'warm' | 'cool';
      }>;
    }
  | {
      type: 'table';
      headers: string[];
      rows: string[][];
    }
  | {
      type: 'callout';
      title: string;
      body: string;
      variant?: 'info' | 'success' | 'warning';
    };

export type LessonSection = {
  id: string;
  title: string;
  description?: string | null;
  content: LessonContentBlock[];
};

export type LessonQuizQuestion = {
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation?: string | null;
};

export type LessonQuiz = {
  title: string;
  questions: LessonQuizQuestion[];
  practiceLink?: {
    href: string;
    label: string;
  };
};

export type LessonPractice = {
  title: string;
  description?: string | null;
  href: string;
  badge?: string | null;
  highlight?: string | null;
};

export type LessonResource = {
  label: string;
  description?: string | null;
  href?: string | null;
};

export type LessonContentData = {
  id: string;
  title: string;
  strapline?: string | null;
  summary?: string | null;
  heroStats: LessonHeroStat[];
  objectives: LessonObjective[];
  sections: LessonSection[];
  quiz?: LessonQuiz | null;
  practice?: LessonPractice | null;
  resources?: LessonResource[] | null;
  manageUrl?: string | null;
};

type SectionNavItem = {
  id: string;
  label: string;
};

const iconLabelMap: Record<string, IconName> = {
  activity: 'activity',
  award: 'award',
  beaker: 'beaker',
  bookopen: 'book-open',
  'book-open': 'book-open',
  brain: 'brain',
  checkcircle: 'check-circle',
  'check-circle': 'check-circle',
  clipboardcheck: 'clipboard-check',
  'clipboard-check': 'clipboard-check',
  compass: 'compass',
  layers: 'layers',
  play: 'play',
  shieldcheck: 'shield-check',
  'shield-check': 'shield-check',
  sparkles: 'sparkles',
  target: 'target',
};

function resolveIcon(icon?: ObjectiveIcon): LucideIcon {
  if (!icon) return Sparkles;
  const key = icon.toString().toLowerCase() as IconName;
  if (ICON_LIBRARY[key]) {
    return ICON_LIBRARY[key];
  }
  const normalized = icon.toString().toLowerCase().replace(/[\s_]/g, '');
  const mapped = iconLabelMap[normalized];
  if (mapped && ICON_LIBRARY[mapped]) {
    return ICON_LIBRARY[mapped];
  }
  return Sparkles;
}

function variantClasses(variant?: string) {
  switch (variant) {
    case 'accent':
      return 'border-orange-100 bg-orange-50/70';
    case 'warm':
      return 'border-amber-100 bg-amber-50/60';
    case 'cool':
      return 'border-blue-100 bg-blue-50/60';
    default:
      return 'border-slate-200 bg-white';
  }
}

function renderBlock(block: LessonContentBlock, key: number) {
  switch (block.type) {
    case 'text':
      return (
        <p
          key={key}
          className={`text-slate-700 ${
            block.variant === 'lead' ? 'text-lg font-medium text-slate-800' : ''
          }`}
        >
          {block.text}
        </p>
      );
    case 'list':
      if (block.style === 'ordered') {
        return (
          <ol key={key} className="list-decimal space-y-2 pl-6 text-slate-700">
            {block.items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
        );
      }
      return (
        <ul key={key} className="list-disc space-y-2 pl-6 text-slate-700">
          {block.items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    case 'card-grid':
      const columnClass =
        block.columns === 1
          ? 'md:grid-cols-1'
          : block.columns === 3
          ? 'md:grid-cols-1 lg:grid-cols-3'
          : 'md:grid-cols-2';
      return (
        <div
          key={key}
          className={`grid gap-6 ${columnClass}`}
        >
          {block.cards.map((card, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-6 shadow-sm ${variantClasses(card.variant)}`}
            >
              <h4 className="font-semibold text-slate-900">{card.title}</h4>
              {card.subtitle && <p className="mt-1 text-sm text-slate-500">{card.subtitle}</p>}
              {card.body && <p className="mt-3 text-sm text-slate-600">{card.body}</p>}
              {card.bullets && (
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {card.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex}>• {bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      );
    case 'table':
      return (
        <div key={key} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {block.headers.map((header, idx) => (
                  <th key={idx} className="px-4 py-3 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {block.rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-orange-50/40 transition">
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="px-4 py-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'callout':
      return (
        <div
          key={key}
          className={`rounded-2xl border p-6 ${
            block.variant === 'warning'
              ? 'border-amber-200 bg-amber-50/70'
              : block.variant === 'success'
              ? 'border-emerald-200 bg-emerald-50/70'
              : 'border-blue-200 bg-blue-50/70'
          }`}
        >
          <h4 className="font-semibold text-slate-900">{block.title}</h4>
          <p className="mt-2 text-sm text-slate-600">{block.body}</p>
        </div>
      );
    default:
      return null;
  }
}

function LessonSectionNav({ sections }: { sections: SectionNavItem[] }) {
  return (
    <nav className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">สารบัญ</h4>
      <ul className="mt-3 space-y-2 text-sm">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="block rounded-lg px-3 py-2 text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function TeacherManageLink({ href }: { href: string }) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4 text-xs text-slate-500">
      <p className="font-semibold text-slate-600">สำหรับครู (รุ่นทดลอง)</p>
      <p className="mt-1">
        ลิงก์นี้ใช้สำหรับเปิดหน้าแก้ไขบทเรียน (ชั่วคราว) เพื่อเตรียมระบบ Classroom ในอนาคต
      </p>
      <Link
        href={href}
        className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-600 transition hover:border-orange-300 hover:text-orange-600"
      >
        เปิดหน้าแก้ไข
      </Link>
    </div>
  );
}

export function buildLessonNav(lesson: LessonContentData): SectionNavItem[] {
  const base: SectionNavItem[] = [
    { id: 'overview', label: 'ภาพรวมบทเรียน' },
    { id: 'objectives', label: 'เป้าหมายการเรียนรู้' },
  ];

  lesson.sections.forEach((section) =>
    base.push({ id: section.id, label: section.title }),
  );

  if (lesson.quiz) {
    base.push({ id: 'lesson-quiz', label: lesson.quiz.title });
  }

  if (lesson.practice) {
    base.push({ id: 'lesson-practice', label: lesson.practice.title });
  }

  if (lesson.resources && lesson.resources.length > 0) {
    base.push({ id: 'lesson-resources', label: 'เอกสารประกอบ' });
  }

  return base;
}

export function LessonContentView({ lesson }: { lesson: LessonContentData }) {
  const sectionNav = useMemo(() => buildLessonNav(lesson), [lesson]);

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start lg:gap-10">
      <article className="space-y-12">
        <section
          id="overview"
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40"
        >
          {lesson.strapline && (
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
              {lesson.strapline}
            </p>
          )}
          <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">{lesson.title}</h2>
          {lesson.summary && <p className="mt-4 text-lg text-slate-600">{lesson.summary}</p>}
          {lesson.heroStats.length > 0 && (
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {lesson.heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 text-center shadow-sm"
                >
                  <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {stat.label}
                  </div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</div>
                  {stat.description && (
                    <div className="mt-1 text-sm text-slate-600">{stat.description}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {lesson.objectives.length > 0 && (
          <section
            id="objectives"
            className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-8 shadow-inner shadow-emerald-100/60"
          >
            <header className="mb-6 flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-emerald-600" />
              <h3 className="text-xl font-semibold text-slate-900">Learning Objectives</h3>
            </header>
            <div className="grid gap-4 md:grid-cols-2">
              {lesson.objectives.map((objective, index) => {
                const Icon = resolveIcon(objective.icon);
                return (
                  <div
                    key={`${objective.text}-${index}`}
                    className="flex items-start gap-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm"
                  >
                    <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">{objective.text}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {lesson.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/40"
          >
            <header className="mb-6">
              <h3 className="text-2xl font-semibold text-slate-900">{section.title}</h3>
              {section.description && (
                <p className="mt-2 text-slate-600">{section.description}</p>
              )}
            </header>
            <div className="space-y-6">
              {section.content.map((block, idx) => renderBlock(block, idx))}
            </div>
          </section>
        ))}

        {lesson.quiz && (
          <section id="lesson-quiz">
            <InteractiveQuiz {...lesson.quiz} />
          </section>
        )}

        {lesson.practice && (
          <section id="lesson-practice">
            <PracticeCallout {...lesson.practice} />
          </section>
        )}

        {lesson.resources && lesson.resources.length > 0 && (
          <section id="lesson-resources">
            <ResourceList resources={lesson.resources} />
          </section>
        )}
      </article>

      <aside className="mt-8 space-y-6 lg:sticky lg:top-28 lg:mt-0">
        <LessonSectionNav sections={sectionNav} />
        {lesson.manageUrl && <TeacherManageLink href={lesson.manageUrl} />}
      </aside>
    </div>
  );
}

function InteractiveQuiz({ title, questions, practiceLink }: LessonQuiz) {
  const [state, setState] = useState({
    current: 0,
    selected: null as number | null,
    score: 0,
    showResult: false,
  });

  const resetState = () =>
    setState({ current: 0, selected: null, score: 0, showResult: false });

  const handleSelect = (optionIndex: number) => {
    if (state.showResult) return;
    const currentQuestion = questions[state.current];
    const isCorrect = optionIndex === currentQuestion.answerIndex;
    setState((prev) => ({
      ...prev,
      selected: optionIndex,
      score: isCorrect ? prev.score + 1 : prev.score,
      showResult: true,
    }));
  };

  const handleNext = () => {
    if (state.current === questions.length - 1) {
      resetState();
      return;
    }
    setState((prev) => ({
      current: prev.current + 1,
      selected: null,
      score: prev.score,
      showResult: false,
    }));
  };

  const current = questions[state.current];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/40">
      <header className="mb-6 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-500">
              ข้อที่ {state.current + 1} จาก {questions.length}
            </p>
          </div>
        </div>
        <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
          คะแนน {state.score}/{questions.length}
        </div>
      </header>

      <div className="space-y-6">
        <p className="text-lg font-medium text-slate-800">{current.prompt}</p>
        <div className="space-y-3">
          {current.options.map((option, idx) => {
            const isCorrect = idx === current.answerIndex;
            const isSelected = idx === state.selected;
            const showState = state.showResult;
            const baseClasses =
              'flex items-center gap-3 rounded-2xl border px-4 py-3 transition focus:outline-none';
            const stateClasses = !showState
              ? 'border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50 cursor-pointer'
              : isCorrect
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : isSelected
              ? 'border-rose-200 bg-rose-50 text-rose-600'
              : 'border-slate-200 bg-white text-slate-500';

            return (
              <button
                key={option}
                type="button"
                className={`${baseClasses} ${stateClasses}`}
                onClick={() => handleSelect(idx)}
                disabled={showState}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-current text-sm font-semibold">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-left text-sm font-medium">{option}</span>
              </button>
            );
          })}
        </div>

        {state.showResult && (
          <div
            className={`rounded-2xl border p-4 ${
              state.selected === current.answerIndex
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-600'
            }`}
          >
            {current.explanation}
          </div>
        )}

        <div className="flex items-center justify-between">
          {practiceLink ? (
            <Link
              href={practiceLink.href}
              className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600 transition hover:border-orange-300 hover:bg-orange-100"
            >
              <Play className="h-4 w-4" />
              {practiceLink.label}
            </Link>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {state.current === questions.length - 1 ? 'เริ่มใหม่' : 'ข้อถัดไป'}
          </button>
        </div>
      </div>
    </section>
  );
}

function PracticeCallout({ title, description, href, badge, highlight }: LessonPractice) {
  return (
    <section className="rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-100 p-8 shadow-lg shadow-orange-100/60">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          {badge && (
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600 shadow-sm">
              <Target className="h-4 w-4" />
              {badge}
            </div>
          )}
          <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
          {description && <p className="text-slate-600">{description}</p>}
          {highlight && <p className="text-sm text-orange-600">{highlight}</p>}
        </div>
        <Link
          href={href}
          className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-1 hover:bg-orange-600"
        >
          เริ่มฝึกทันที
        </Link>
      </div>
    </section>
  );
}

function ResourceList({ resources }: { resources: LessonResource[] }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/40">
      <header className="mb-6 flex items-center gap-3">
        <CheckCircle2 className="h-6 w-6 text-slate-600" />
        <h3 className="text-xl font-semibold text-slate-900">เอกสารประกอบ</h3>
      </header>
      <ul className="space-y-4">
        {resources.map((item) => (
          <li
            key={item.label}
            className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
          >
            <div>
              <p className="font-semibold text-slate-800">{item.label}</p>
              {item.description && <p className="text-sm text-slate-600">{item.description}</p>}
            </div>
            {item.href && (
              <Link
                href={item.href}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-orange-200 hover:text-orange-600"
              >
                เปิดดู
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

