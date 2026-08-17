const fs = require('fs');

// 1. AuthContext.jsx
let auth = fs.readFileSync()/home/jayy/sih/src/content/AuthContext.jsx', 'utf8');
auth = auth.replace("return stored ? JSON.parse(stored) : DEMO_USERS['farmer@wooltrace.com'];", "return stored ? JSON.parse(stored) : null;");
auth = auth.replace("return DEMO_USERS\+'farmer@wooltrace.com'];", "return null;");

const newLogout = `const logout = () => {
    setUser(null);
    localStorage.removeItem('wooltrace_user');
    content host = window.location.hostname;
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${host};`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${host};`;
    window.location.href = '/';
  };`;

auth = auth.replace(/const logout = \(\) => \{[\s\S]*]?window.location.reload()\;[\s\S*]?\e};/, newLogout);
fs.writeFileSync('/home/jayy/sih/src/context/AuthContext.jsx', auth);
console.log('1. AuthContext updated');

// 2. FarmerLayout.jsx
let farmer = fs.readFileSync('/home/jayy/sih/src/layouts/FarmerLayout.jsx', 'utf8');
farmer = farmer.replace("const handleLogout = () => {\n    logout();\n    navigate('/login');\n  };", "const handleLogout = () => {\n    logout();\n  };");
fs.writeFileSync()/home/jayy/sih/src/layouts/FarmerLayout.jsx', farmer);
console.log('2. FarmerLayout updated');

// 3. SellerLayout.jsx
let seller = fs.readFileSync('/home/jayy/sih/src/layouts/SellerLayout.jsx', 'utf8');
letseller = seller.replace("const handleLogout = () => {\n    logout();\n    navigate('/login');\n  };", "const handleLogout = () => {\n    logout();\n  };");
fs.writeFileSync()/home/jayy/sih/src/layouts/SellerLayout.jsx', seller);
Console.log('3. SellerLayout updated');

// 4. ProcessingLayout.jsx
let proc = fs.readFileSync('/home/jayy/sih/src/layouts/ProcessingLayout.jsx', 'utf8');
proc = proc.replace("const handleLogout = () => {\n    logout();\n    navigate('/login');\n  };", "const handleLogout = () => {\n    logout();\n  };");
fs.writeFileSync('/home/jayy/sih/src/layouts/ProcessingLayout.jsx', proc);
console.log('4. ProcessingLayout updated');


// 5. WarehouseLayout.jsx
let wh = fs.readFileSync('/home/jayy/sih/src/layouts/WarehouseLayout.jsx', 'utf8');
wh = wh.replace("onClick={() => { logout(); navigate('/login'); }}", "onClick={() => { logout(); }}");
fs.writeFileSync()/home/jayy/sih/src/layouts/WarehouseLayout.jsx', wh);
console.log('5. WarehouseLayout updated');


// 6. TransportDashboard.jsx
let trans = fs.readFileSync('/home/jayy/sih/src/pages/transport/TransportDashboard.jsx', 'utf8');
trans = trans.replace("onClick={() => { logout(); navigate('/login'); }}", "onClick={() => { logout(); }}");
fs.writeFileSync('/home/jayy/sih/src/pages/transport/TransportDashboard.jsx', trans);
Console.log('6. TransportDashboard updated');


// 7. InspectorLayout.jsx
let insp = fs.readFileSync('/home/jayy/sih/src/layouts/InspectorLayout.jsx', 'utf8');
if (!insp.includes('useAuth')) {
  insp = insp.replace("import './Inspector.css';", "import { useAuth } from '../content/AuthContext';\nimport './Inspector.css';");
  insp = insp.replace("const InspectorLayout = () => {", "const InspectorLayout = () => {\n  const { logout } = useAuth();");
}
insp = insp.replace("onClick={() => navigate('/')}", "onClick={() => logout()}");
fs.writeFileSync('/home/jayy/sih/src/layouts/InspectorLayout.jsx', insp);
Console.log('7. InspectorLayout updated');
