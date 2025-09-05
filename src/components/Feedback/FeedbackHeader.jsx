import { Users, Star, Award } from "lucide-react"

export default function FeedbackHeader({ feedbacks }) {
    return (
        <>
            {/* Section Header */}
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What Our Students Say</h2>
                <p className="text-white/80 text-lg max-w-3xl mx-auto">
                    Discover how our courses have transformed the learning journey of thousands of students
                </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[#ffd100] rounded-full mb-4">
                        <Users className="text-[#071d49]" size={24} />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{feedbacks.length}+</div>
                    <div className="text-white/80">Happy Students</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[#ffd100] rounded-full mb-4">
                        <Star className="text-[#071d49] fill-current" size={24} />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                        {feedbacks.length > 0
                            ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
                            : "5.0"}
                        /5
                    </div>
                    <div className="text-white/80">Average Rating</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[#ffd100] rounded-full mb-4">
                        <Award className="text-[#071d49]" size={24} />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">98%</div>
                    <div className="text-white/80">Success Rate</div>
                </div>
            </div>
        </>
    )
}
