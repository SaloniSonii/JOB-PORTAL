import express from 'express'
import { ChangeJobApplicationsStatus, changeVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/companyController.js'

const router = express.Router()

//Register a company
router.post('/register', registerCompany)

//company login
router.post('/login', loginCompany)

//Get company data
router.get('/company', getCompanyData)

//Post a new job
router.post('/post-job', postJob)

//Get applicants data of company
router.get('/applicants', getCompanyJobApplicants)

//Get company job list
router.get('/list-jobs', getCompanyPostedJobs)

//Change application status
router.post('/change-status', ChangeJobApplicationsStatus)

//Change applications visibility
router.post('/change-visibility', changeVisibility) 

export default router