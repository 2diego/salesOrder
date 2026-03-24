import './SegmentedTabs.css';

export interface SegmentedTab {
  key: string;
  label: string;
}

interface SegmentedTabsProps {
  tabs: SegmentedTab[];
  activeKey: string;
  onChange: (key: string) => void;
  stretch?: boolean;
}

const SegmentedTabs = ({
  tabs,
  activeKey,
  onChange,
  stretch = true,
}: SegmentedTabsProps) => {
  return (
    <div className={`segmented-tabs ${stretch ? 'segmented-tabs--stretch' : ''}`}>
      {tabs.map((t) => {
        const active = t.key === activeKey;
        return (
          <button
            key={t.key}
            type="button"
            className={`segmented-tab ${active ? 'segmented-tab--active' : ''}`}
            aria-pressed={active}
            onClick={() => onChange(t.key)}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedTabs;

