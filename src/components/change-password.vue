<template>
    <!--<div class="c-change-password">-->
        <el-dialog :visible.sync="dialog"
                     title="修改密码"
                     size="tiny"
                     :close-on-click-modal="false">
            <el-form :model="form" label-width="120px" :rules="rules" ref="formData">
                <el-form-item label="用户名：">
                    <span>{{username}}</span>
                </el-form-item>
                <el-form-item label="原始密码：" prop="old_password">
                    <el-input v-model="form.old_password"
                              class="inline"
                              @blur="blur_verify(form.old_password)"
                              style="width:72%"
                              type="password"></el-input>
                    <span class="inline red" v-if="!isTrue">原始密码不正确</span>
                </el-form-item>
                <el-form-item label="新密码：" prop="password">
                    <el-input v-model="form.password"
                              @blur="affirm_new_pass(form.password,form.confirm_password)"
                              style="width:72%"
                              type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码：" prop="confirm_password">
                    <el-input v-model="form.confirm_password"
                              class="inline"
                              @blur="affirm_new_pass(form.password,form.confirm_password)"
                              style="width:72%" type="password"
                    ></el-input>
                    <span class="inline red" v-if="!isSame">两次输入不一致</span>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" size="mini"
                           class="inline"
                           @click.native="submit">提交</el-button>
                <el-button size="mini" class="inline"
                           @click.native="dialog = false">取消</el-button>
            </div>
        </el-dialog>
    <!--</div>-->
</template>
<style lang="stylus" scoped>

</style>
<script>
    import {api_check_password} from '../api/user';
    import {api_update_password} from '../api/user-management';
    export default {
        data() {
            let checkOldPass = (rule,value,callback)=>{
                return !integer.test(value) ? callback(new Error("非法数据，请重新输入")):callback();
            };
            return {
                isTrue:true,
                isSame:true,
                dialog:this.value,
                form:{
                    old_password:"",
                    password:"",
                    confirm_password:"",
                },
                rules:{
                    old_password:[
                        {required:true,message:"原始密码不能为空",trigger:"change"},
                    ],
                    password:[
                        {required:true,message:"新密码不能为空",trigger:"change"},
                    ],
                    confirm_password:[
                        {required:true,message:"确认密码不能为空",trigger:"change"},
                    ]
                }
            }
        },
        watch:{
            dialog(val){
                this.$emit("input",val);
            },
            value(val){
                this.dialog = val;
                if(val){
                    this.form = {
                        old_password:"",
                        password:"",
                        confirm_password:"",
                    };
                }
            },
        },
        methods:{
            submit(){
                this.$refs.formData.validate(b=>{
                    if(b){
                        this.$http(api_update_password,this.form).then(res=>{
                            this.$message({type:"success",message:`${res.message||res}，即将重新登陆`});
                            setTimeout(()=>{
                                this.$router.replace('/login');
                            },1500);
                        }).catch(code=>{
                            this.$message({type:"error",message:code.message||code});
                        })
                    }
                });
            },
            blur_verify(val){
                if(!val)return;
                this.$http(api_check_password,{old_password:val}).then(res=>{
                    this.isTrue = true;
                }).catch(code=>{
                    this.isTrue = false;
                })
            },
            affirm_new_pass(pass1,pass2){
                if(!pass2)return;
                this.isSame = pass1===pass2?true:false;
            },

        },
        props:{
            username:{
                required:true,
            },
            value:{},
        },
        components: {
            pageDialog:require('./page-dialog.vue').default,
        }
    }
</script>