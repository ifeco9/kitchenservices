import Icon from '@/components/ui/AppIcon';

interface TimelineStage {
  stage: string;
  title: string;
  duration: string;
  requirements: string[];
  icon: string;
}

interface VerificationTimelineProps {
  stages: TimelineStage[];
}

export default function VerificationTimeline({ stages }: VerificationTimelineProps) {
  return (
    <div className="space-y-8">
      {stages.map((stage, index) => (
        <div key={index} className="relative flex gap-6">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-accent rounded-full shadow-subtle">
              <Icon name={stage.icon as any} size={20} className="text-white" />
            </div>
            {index < stages.length - 1 && (
              <div className="w-px h-full bg-border mt-2" />
            )}
          </div>
          <div className="flex-1 pb-8">
            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-2">
                    {stage.stage}
                  </span>
                  <h4 className="text-lg font-semibold text-text-primary">{stage.title}</h4>
                </div>
                <span className="text-sm text-text-secondary font-medium">{stage.duration}</span>
              </div>
              <ul className="space-y-2">
                {stage.requirements.map((req, reqIndex) => (
                  <li key={reqIndex} className="flex items-start gap-2 text-sm text-text-secondary">
                    <Icon name="CheckCircleIcon" size={16} className="text-accent mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}