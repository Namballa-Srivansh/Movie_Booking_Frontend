import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-50 text-slate-600 border-t border-slate-200 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-slate-900 text-xl font-bold">MovieBook</h3>
                        <p className="text-sm leading-relaxed">
                            Experience movies like never before. Book tickets, explore showtimes,
                            and get exclusive offers directly from your device.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <SocialIcon Icon={Twitter} />
                            <SocialIcon Icon={Instagram} />
                            <SocialIcon Icon={Facebook} />
                            <SocialIcon Icon={Linkedin} />
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-slate-900 font-semibold mb-4">Discovery</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-indigo-600 transition-colors">Now Showing</a></li>
                            <li><a href="#" className="hover:text-indigo-600 transition-colors">Coming Soon</a></li>
                            <li><a href="#" className="hover:text-indigo-600 transition-colors">Cinemas</a></li>
                            <li><a href="#" className="hover:text-indigo-600 transition-colors">Experiences</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-slate-900 font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-indigo-600 transition-colors">My Profile</a></li>
                            <li><a href="#" className="hover:text-indigo-600 transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-slate-200 pt-8 text-center text-xs">
                    <p>© 2026 MovieBook Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ Icon }: { Icon: any }) {
    return (
        <a href="#" className="p-2 rounded-full bg-slate-200 hover:bg-indigo-600 hover:text-white transition-colors">
            <Icon className="w-4 h-4" />
        </a>
    );
}
