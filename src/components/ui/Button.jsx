import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-primary text-white shadow-[0_12px_24px_-14px_rgba(35,78,112,0.45)] hover:bg-[#1c4462]',
  secondary: 'bg-secondary text-white shadow-[0_12px_24px_-14px_rgba(201,162,39,0.45)] hover:bg-[#b08c1f]',
  outline: 'border border-slate-200 bg-white text-primary hover:bg-slate-50 hover:border-slate-300',
};

const Button = ({ children, variant = 'primary', className = '', as: Component = 'button', ...props }) => {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300';
  const classes = `${base} ${variants[variant]} ${className}`.trim();

  return (
    <motion.div whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
      <Component className={classes} {...props}>
        {children}
      </Component>
    </motion.div>
  );
};

export default Button;
