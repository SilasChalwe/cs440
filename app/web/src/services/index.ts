import { API_CONFIG } from '../config/api'
import { httpSystemService } from './httpSystemService'
import { mockSystemService } from './mockSystemService'
import type { SystemService } from './systemService'

export const systemService: SystemService = API_CONFIG.mode === 'http' ? httpSystemService : mockSystemService
