import { Users, Star, Award } from "lucide-react"

export default function FeedbackHeader({ feedbacks }) {
    return (
        <>
            <div className="relative mb-10">
                <div className="text-center mb-10">
                    <span className="sc-eyebrow mb-4">Testimonials</span>
                    <h2 className="font-display text-3xl md:text-5xl font-bold text-[#071d49] mb-3">What Our Students Say</h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Discover how our courses have transformed the learning journey of thousands of students
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <div className="text-center bg-white rounded-2xl p-6 border border-[rgba(7,29,73,0.08)] shadow-[0_10px_30px_rgba(7,29,73,0.06)]">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#071d49] rounded-xl mb-4">
                            <Users className="text-[#ffd100]" size={22} />
                        </div>
                        <div className="font-display text-3xl font-bold text-[#071d49] mb-1">{feedbacks.length}+</div>
                        <div className="text-slate-500 text-sm font-medium">Happy Students</div>
                    </div>
                    <div className="text-center bg-white rounded-2xl p-6 border border-[rgba(7,29,73,0.08)] shadow-[0_10px_30px_rgba(7,29,73,0.06)]">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#071d49] rounded-xl mb-4">
                            <Star className="text-[#ffd100] fill-current" size={22} />
                        </div>
                        <div className="font-display text-3xl font-bold text-[#071d49] mb-1">
                            {feedbacks.length > 0
                                ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
                                : "5.0"}
                            /5
                        </div>
                        <div className="text-slate-500 text-sm font-medium">Average Rating</div>
                    </div>
                    <div className="text-center bg-white rounded-2xl p-6 border border-[rgba(7,29,73,0.08)] shadow-[0_10px_30px_rgba(7,29,73,0.06)]">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#071d49] rounded-xl mb-4">
                            <Award className="text-[#ffd100]" size={22} />
                        </div>
                        <div className="font-display text-3xl font-bold text-[#071d49] mb-1">98%</div>
                        <div className="text-slate-500 text-sm font-medium">Success Rate</div>
                    </div>
                </div>
            </div>
        </>
    )
}
