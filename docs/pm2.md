# PM2 Configuration Guide

## Cluster Mode Overview

PM2's cluster mode is a powerful feature that enables your Node.js application to run in multiple instances across all available CPU cores. This provides several benefits:

1. **Load Balancing**: Automatically distributes incoming requests across all instances
2. **High Availability**: If one instance crashes, others continue running
3. **Zero Downtime**: Enables zero-downtime reloads and updates
4. **CPU Utilization**: Makes full use of all available CPU cores

## Configuration Explained

### Cluster Settings
```javascript
{
  instances: 'max',     // Use all available CPU cores
  exec_mode: 'cluster', // Run in cluster mode
  wait_ready: true      // Wait for app to send ready signal
}
```

- `instances`: 
  - `'max'`: Uses all available CPU cores
  - `'0'`: Uses number of CPU cores minus 1
  - `number`: Uses specific number of instances
  - `-1`: Uses number of CPU cores minus 1

- `exec_mode`: 
  - `'cluster'`: Runs in cluster mode
  - `'fork'`: Runs in fork mode (single instance)

### Process Management
```javascript
{
  autorestart: true,    // Auto restart if app crashes
  watch: false,         // Disable watch mode in production
  max_memory_restart: '1G' // Restart if memory exceeds 1GB
}
```

### Graceful Shutdown
```javascript
{
  kill_timeout: 3000    // Wait 3 seconds before force kill
}
```

## Common Commands

### Starting the Application
```bash
# Start with cluster mode
pm2 start ecosystem.config.js --env production

# Start with specific number of instances
pm2 start ecosystem.config.js -i 4 --env production
```

### Monitoring
```bash
# View all processes
pm2 list

# Monitor CPU/Memory usage
pm2 monit

# View logs
pm2 logs nft-balance-checker

# View specific instance logs
pm2 logs nft-balance-checker --lines 100
```

### Process Management
```bash
# Restart application
pm2 restart nft-balance-checker

# Stop application
pm2 stop nft-balance-checker

# Delete from PM2
pm2 delete nft-balance-checker
```

### Zero-Downtime Reload
```bash
# Reload all instances one by one
pm2 reload nft-balance-checker

# Reload with specific number of instances
pm2 reload nft-balance-checker -i 4
```

## Best Practices

1. **Instance Count**
   - Use `max` for CPU-intensive applications
   - Use `0` or `-1` for I/O-intensive applications
   - Monitor CPU usage to find optimal instance count

2. **Memory Management**
   - Set appropriate `max_memory_restart` based on your application's needs
   - Monitor memory usage with `pm2 monit`
   - Consider using `--max-memory-restart` for individual instances

3. **Logging**
   - Use PM2's built-in log rotation
   - Monitor logs regularly
   - Set up log aggregation for production

4. **Monitoring**
   - Use `pm2 monit` for real-time monitoring
   - Set up PM2 Plus for advanced monitoring
   - Configure alerts for crashes and high resource usage

## Production Considerations

1. **Environment Variables**
   - Use `env_production` for production-specific variables
   - Keep sensitive data in `.env` files
   - Use PM2's environment variable management

2. **Security**
   - Run PM2 as a non-root user
   - Use PM2's built-in security features
   - Keep PM2 and Node.js updated

3. **Performance**
   - Monitor and adjust instance count
   - Use appropriate memory limits
   - Configure proper logging levels

4. **Maintenance**
   - Regular updates of PM2 and Node.js
   - Monitor and clean logs
   - Regular health checks 