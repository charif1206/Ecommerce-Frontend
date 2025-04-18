import {motion} from "framer-motion";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export const SalesChart = ({data}) => (
    <motion.div
        className="hidden md:block bg-white rounded-lg p-6 shadow-lg"
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5, delay: 0.25}}
    >
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#374151" />
                <YAxis yAxisId="left" stroke="#374151" />
                <YAxis yAxisId="right" orientation="right" stroke="#374151" />
                <Tooltip />
                <Legend />
                <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="sales"
                    stroke="#10B981"
                    activeDot={{r: 8}}
                    name="Sales"
                />
                <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    activeDot={{r: 8}}
                    name="Revenue"
                />
            </LineChart>
        </ResponsiveContainer>
    </motion.div>
);
