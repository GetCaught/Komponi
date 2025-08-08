import Link from 'next/link'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { Search, Star, Users, TrendingUp, Shield, Clock } from 'lucide-react'

export default function HomePage() {

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">komponi<span className="text-green-500">.</span></h1>
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/campaigns/browse" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  Find Work
                </Link>
                <Link href="/influencers/browse" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  Find Talent
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Join
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
                Find the right
                <span className="text-green-500"> influencer</span>
                <br />right away
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-lg">
                Work with the largest network of independent professionals and get things done—from quick turnarounds to big transformations.
              </p>
              
              {/* Search Bar */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder='Try "logo design"'
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                  Search
                </button>
              </div>
              
              <div className="mt-6 flex items-center space-x-4 text-sm text-gray-600">
                <span>Popular:</span>
                <Link href="#" className="hover:text-green-500">Logo Design</Link>
                <Link href="#" className="hover:text-green-500">Social Media</Link>
                <Link href="#" className="hover:text-green-500">Content Creation</Link>
                <Link href="#" className="hover:text-green-500">Photography</Link>
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0">
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow-lg p-4 transform rotate-2">
                      <div className="w-12 h-12 bg-pink-100 rounded-full mb-2"></div>
                      <div className="text-sm font-semibold">Beauty & Lifestyle</div>
                      <div className="text-xs text-gray-500">1,234 influencers</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-4 transform -rotate-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-full mb-2"></div>
                      <div className="text-sm font-semibold">Tech & Gaming</div>
                      <div className="text-xs text-gray-500">856 influencers</div>
                    </div>
                  </div>
                  <div className="space-y-4 mt-8">
                    <div className="bg-white rounded-xl shadow-lg p-4 transform rotate-1">
                      <div className="w-12 h-12 bg-green-100 rounded-full mb-2"></div>
                      <div className="text-sm font-semibold">Fitness & Health</div>
                      <div className="text-xs text-gray-500">967 influencers</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-4 transform -rotate-2">
                      <div className="w-12 h-12 bg-purple-100 rounded-full mb-2"></div>
                      <div className="text-sm font-semibold">Food & Travel</div>
                      <div className="text-xs text-gray-500">1,456 influencers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Services Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular professional services</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { name: 'Logo Design', color: 'bg-orange-100 text-orange-600' },
              { name: 'Social Media', color: 'bg-green-100 text-green-600' },
              { name: 'Content Writing', color: 'bg-purple-100 text-purple-600' },
              { name: 'Photography', color: 'bg-blue-100 text-blue-600' },
              { name: 'Video Editing', color: 'bg-pink-100 text-pink-600' }
            ].map((service, index) => (
              <Link key={index} href="#" className="group">
                <div className="bg-gray-50 group-hover:bg-gray-100 rounded-lg p-4 transition-colors">
                  <div className={`w-12 h-12 rounded-lg ${service.color} flex items-center justify-center mb-3`}>
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">{service.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              A whole world of freelance talent at your fingertips
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Over 700 categories</h3>
              <p className="text-gray-600">Get results from every corner of the creative world</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Clear, transparent pricing</h3>
              <p className="text-gray-600">Pay per project or by the hour. Payments only get released when you approve</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality work done faster</h3>
              <p className="text-gray-600">Filter to find the right freelancers quickly and get great work delivered in no time</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 award-winning support</h3>
              <p className="text-gray-600">Chat with our team to get your questions answered or resolve any issues</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">What they&apos;re saying about Komponi</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Kay Kim, Co-Founder', company: 'rooted', text: '"It&apos;s extremely exciting that Komponi has freelancers from all over the world — it broadens the talent pool. One of the best things about Komponi is that while we&apos;re sleeping, someone&apos;s working."', rating: 5 },
              { name: 'Caitlin Tormey, Chief Commercial Officer', company: 'Naadam', text: '"We&apos;ve used Komponi for Shopify web development, graphic design, and copywriting. Working with Komponi makes my job a little easier every day."', rating: 5 },
              { name: 'Tim and Dan Joo, Co-Founders', company: 'Haerfest', text: '"When you want to create a business bigger than yourself, you need a lot of help. That&apos;s what Komponi does."', rating: 5 }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">{testimonial.text}</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600 font-semibold">{testimonial.company.toUpperCase()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 via-green-500 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              Find the talent needed to get your business growing
            </h2>
            <div className="mt-10">
              <Link
                href="/signup"
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-block"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-gray-900">Graphics & Design</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Digital Marketing</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Writing & Translation</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Video & Animation</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Music & Audio</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">About</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-gray-900">Careers</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Press & News</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Partnerships</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-gray-900">Help & Support</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Trust & Safety</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Selling on Komponi</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Buying on Komponi</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-gray-900">Events</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Blog</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Forum</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Community Standards</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">More From Komponi</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-gray-900">Komponi Pro</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Komponi Studios</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Get Inspired</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Komponi Select</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <h3 className="text-2xl font-bold text-gray-900 mr-8">komponi<span className="text-green-500">.</span></h3>
                <p className="text-sm text-gray-600">© Komponi International Ltd. 2024</p>
              </div>
              <div className="flex items-center space-x-6">
                <Link href="#" className="text-gray-400 hover:text-gray-900">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-gray-900">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-gray-900">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 