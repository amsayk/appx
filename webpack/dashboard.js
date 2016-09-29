const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');

function MyPlugin() {
  this.dashboard = new Dashboard();
}

MyPlugin.prototype.apply = function(compiler) {
 compiler.apply(new DashboardPlugin(this.dashboard.setData));
};

module.exports = MyPlugin;
