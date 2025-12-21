import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface Technician {
  id: string;
  name: string;
  specialization: string;
  location: string;
  rating: number;
  reviewCount: number;
  image: string;
  alt: string;
  verified: boolean;
  responseTime: string;
}

const FeaturedTechnicians = () => {
  const technicians: Technician[] = [
  {
    id: '1',
    name: 'James Mitchell',
    specialization: 'Oven & Cooker Specialist',
    location: 'London',
    rating: 4.9,
    reviewCount: 127,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_12ac3c371-1763295220735.png",
    alt: 'Professional male technician in blue work uniform holding tools in modern kitchen',
    verified: true,
    responseTime: '< 2 hours'
  },
  {
    id: '2',
    name: 'Sarah Thompson',
    specialization: 'Dishwasher & Washing Machine Expert',
    location: 'Manchester',
    rating: 5.0,
    reviewCount: 94,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_10df5a971-1765003957966.png",
    alt: 'Female technician with short brown hair in professional work attire smiling confidently',
    verified: true,
    responseTime: '< 1 hour'
  },
  {
    id: '3',
    name: 'David Chen',
    specialization: 'Refrigeration & Cooling Systems',
    location: 'Birmingham',
    rating: 4.8,
    reviewCount: 156,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_19119c4c9-1764795154355.png",
    alt: 'Asian male technician with beard wearing safety glasses and work vest in workshop',
    verified: true,
    responseTime: '< 3 hours'
  }];


  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
              Meet Our Top-Rated Technicians
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl">
              Verified professionals with proven track records and excellent customer reviews
            </p>
          </div>
          <Link
            href="/find-a-technician"
            className="inline-flex items-center text-accent font-semibold hover:text-success transition-smooth mt-4 lg:mt-0">

            <span>View All Technicians</span>
            <Icon name="ArrowRightIcon" size={20} className="ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Technician Card */}
          <Link
            href="/technician-profiles"
            className="group md:row-span-2 bg-white rounded-xl overflow-hidden border border-border hover:border-accent transition-smooth block relative">
            <div className="relative h-80 md:h-full overflow-hidden">
              <AppImage
                src={technicians[0].image}
                alt={technicians[0].alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
              
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              
              {/* Technician info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold">{technicians[0].name}</h3>
                  {technicians[0].verified && (
                    <div className="inline-flex items-center px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full shadow-lg">
                      <Icon name="CheckBadgeIcon" size={16} className="mr-1" />
                      Verified
                    </div>
                  )}
                </div>
                <p className="text-white/90 mb-2">{technicians[0].specialization}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Icon name="StarIcon" size={18} className="text-warning mr-1" variant="solid" />
                    <span>{technicians[0].rating} ({technicians[0].reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <Icon name="MapPinIcon" size={16} className="mr-1" />
                    <span>{technicians[0].location}</span>
                  </div>
                </div>
              </div>
              
              {technicians[0].verified && (
                <div className="absolute top-4 right-4 inline-flex items-center px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full shadow-lg md:hidden">
                  <Icon name="CheckBadgeIcon" size={16} className="mr-1" />
                  Verified
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center text-sm text-text-secondary">
                  <Icon name="ClockIcon" size={16} className="mr-1" />
                  Response: {technicians[0].responseTime}
                </div>
                <div className="flex items-center text-accent font-medium">
                  <span>View Profile</span>
                  <Icon name="ArrowRightIcon" size={16} className="ml-1" />
                </div>
              </div>
            </div>
          </Link>

          {/* Secondary Technician Cards */}
          <div className="grid grid-cols-1 gap-6">
            {technicians.slice(1).map((tech) => (
              <Link
                key={tech.id}
                href="/technician-profiles"
                className="group bg-white rounded-xl overflow-hidden border border-border hover:border-accent transition-smooth block relative">

                <div className="flex">
                  <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden">
                    <AppImage
                      src={tech.image}
                      alt={tech.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
                    {tech.verified && (
                      <div className="absolute top-1 right-1 inline-flex items-center bg-accent text-accent-foreground text-xs font-semibold rounded-full p-1 shadow-lg">
                        <Icon name="CheckBadgeIcon" size={12} />
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-primary group-hover:text-accent transition-smooth text-sm">
                        {tech.name}
                      </h3>
                    </div>

                    <p className="text-text-secondary text-xs mb-2">{tech.specialization}</p>

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1">
                        <Icon name="StarIcon" size={14} className="text-warning" variant="solid" />
                        <span className="text-xs font-semibold text-primary">{tech.rating}</span>
                        <span className="text-text-secondary text-xs">({tech.reviewCount})</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-text-secondary text-xs">
                        <Icon name="MapPinIcon" size={12} className="mr-1" />
                        {tech.location}
                      </div>
                      <div className="text-accent text-xs font-medium flex items-center">
                        <span>View</span>
                        <Icon name="ArrowRightIcon" size={12} className="ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>);

};

export default FeaturedTechnicians;