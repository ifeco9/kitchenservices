'use client';

import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface SuccessStory {
  id: number;
  name: string;
  location: string;
  image: string;
  alt: string;
  beforeEarnings: string;
  afterEarnings: string;
  timeframe: string;
  testimonial: string;
  achievements: string[];
}

const SuccessStories = () => {
  const stories: SuccessStory[] = [
  {
    id: 1,
    name: "Robert Taylor",
    location: "Leeds",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_132868c4c-1764848456328.png",
    alt: "Middle-aged male technician in red work shirt smiling confidently with arms crossed in workshop",
    beforeEarnings: "£1,800/month",
    afterEarnings: "£4,500/month",
    timeframe: "8 months",
    testimonial: "I was struggling to find consistent work before joining KitchenServices. Now I have more bookings than I can handle and I've been able to hire an assistant. The platform completely transformed my business.",
    achievements: [
    "Increased monthly revenue by 150%",
    "Built a 5-star reputation with 200+ reviews",
    "Expanded service area to cover 3 cities",
    "Hired first employee to handle demand"]

  },
  {
    id: 2,
    name: "Lisa Anderson",
    location: "Bristol",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e9f7a797-1765107320838.png",
    alt: "Professional female technician in blue work uniform holding tablet and smiling in modern kitchen",
    beforeEarnings: "£2,200/month",
    afterEarnings: "£5,100/month",
    timeframe: "6 months",
    testimonial: "As a woman in this industry, building trust with customers was always challenging. The verification badge gave me instant credibility, and the platform's support helped me grow faster than I ever imagined.",
    achievements: [
    "Became top-rated technician in Bristol",
    "Achieved 98% customer satisfaction rate",
    "Doubled service offerings",
    "Featured in platform success stories"]

  },
  {
    id: 3,
    name: "Mohammed Khan",
    location: "Glasgow",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ff09c345-1764769536232.png",
    alt: "Young South Asian male technician in grey uniform examining appliance with professional tools",
    beforeEarnings: "£1,500/month",
    afterEarnings: "£3,800/month",
    timeframe: "5 months",
    testimonial: "I started my business just before joining the platform. Within five months, I went from barely covering costs to having a thriving business with regular customers. The automated booking system saves me hours every week.",
    achievements: [
    "Grew from 0 to 150+ completed jobs",
    "Maintained 4.9-star average rating",
    "Reduced admin time by 70%",
    "Established loyal customer base"]

  }];


  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-4">
            <Icon name="TrophyIcon" size={20} className="text-accent mr-2" />
            <span className="text-sm font-medium text-accent">Real Success Stories</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Technicians Who Transformed Their Business
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Discover how real technicians across the UK have grown their businesses and increased their earnings through our platform.
          </p>
        </div>

        {/* Success Stories */}
        <div className="space-y-12">
          {stories.map((story, index) =>
          <div
            key={story.id}
            className={`grid lg:grid-cols-2 gap-8 items-center ${
            index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`
            }>

              {/* Image Section */}
              <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <div className="aspect-[4/3] relative">
                    <AppImage
                    src={story.image}
                    alt={story.alt}
                    className="w-full h-full object-cover" />

                  </div>
                  {/* Earnings Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <p className="text-sm opacity-80 mb-1">Before</p>
                        <p className="text-2xl font-bold">{story.beforeEarnings}</p>
                      </div>
                      <Icon name="ArrowRightIcon" size={24} className="opacity-60" />
                      <div>
                        <p className="text-sm opacity-80 mb-1">After</p>
                        <p className="text-2xl font-bold text-accent">{story.afterEarnings}</p>
                      </div>
                    </div>
                    <p className="text-xs text-white/80 mt-2">In just {story.timeframe}</p>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full">
                    <Icon name="CheckBadgeIcon" size={24} className="text-accent" variant="solid" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary">{story.name}</h3>
                    <p className="text-sm text-text-secondary flex items-center">
                      <Icon name="MapPinIcon" size={14} className="mr-1" />
                      {story.location}
                    </p>
                  </div>
                </div>

                <blockquote className="text-lg text-text-secondary leading-relaxed mb-6 italic border-l-4 border-accent pl-4">
                  &quot;{story.testimonial}&quot;
                </blockquote>

                <div className="bg-surface rounded-xl p-6">
                  <h4 className="text-sm font-semibold text-primary mb-4 flex items-center">
                    <Icon name="SparklesIcon" size={18} className="text-accent mr-2" />
                    Key Achievements
                  </h4>
                  <ul className="space-y-3">
                    {story.achievements.map((achievement, i) =>
                  <li key={i} className="flex items-start space-x-3">
                        <Icon name="CheckCircleIcon" size={20} className="text-success flex-shrink-0 mt-0.5" variant="solid" />
                        <span className="text-sm text-text-secondary">{achievement}</span>
                      </li>
                  )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-primary mb-4">
            Ready to Write Your Success Story?
          </h3>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Join thousands of technicians who have transformed their businesses with KitchenServices. Start your journey today.
          </p>
          <a
            href="#registration"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-accent rounded-lg hover:bg-success shadow-cta hover:shadow-lg hover:-translate-y-0.5 transition-smooth focus-ring">

            Start Your Registration
            <Icon name="ArrowRightIcon" size={20} className="ml-2" />
          </a>
        </div>
      </div>
    </section>);

};

export default SuccessStories;