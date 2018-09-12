<template>
    <div class="import-page">
        <h1>Import snippets</h1>

        <h2>Step 1 - Generate CSV</h2>

        <p>You can download our CSV template which you can open in something like Excel, this will allow you to define
            lots of snippets and is a good way of getting started with CYRUS.</p>

        <a class="button block primary"

           @click="onDownloadCSVClicked">Download CSV template</a>

        <br/>

        <hr/>

        <h2>Step 2 - Import</h2>

        <p>If you alreay have a CSV file, either you created it in Step 1 or a friend has provided one, click here to
            import it.</p>

        <a class="button block primary">Import CSV template</a>
    </div>
</template>

<script>
	import { importExportActions } from './../../store/types'

	export default {
		name: "Import",

		methods: {
			onDownloadCSVClicked() {
				this.$store.dispatch(importExportActions.GENERATE_TEMPLATE)
			}
		}
	}
</script>

<style scoped>
    .button.block {
        display: block;
    }

</style>