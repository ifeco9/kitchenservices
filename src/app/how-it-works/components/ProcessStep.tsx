interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
  icon: string;
  isLast?: boolean;
}

export default function ProcessStep({ number, title, description, icon, isLast = false }: ProcessStepProps) {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="flex items-center justify-center w-20 h-20 bg-accent rounded-full shadow-cta mb-4">
        <span className="text-3xl">{icon}</span>
      </div>
      <div className="absolute top-10 left-1/2 w-px h-24 bg-border -z-10" style={{ display: isLast ? 'none' : 'block' }} />
      <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-3">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary text-sm max-w-xs">{description}</p>
    </div>
  );
}